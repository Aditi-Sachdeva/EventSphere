
const crypto = require("crypto");
const mongoose = require("mongoose");

const Event = require("../models/Event");
const Club = require("../models/Club");
const User = require("../models/User");

const {
    sendRegistrationEmail
} = require("../utils/sendRegistrationEmail");

const {
    sendCancellationEmail
} = require("../utils/sendCancellationEmail");

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

function isAuthorized(user, club) {
    if (!user || !club) return false;

    return (
        user.role === "admin" ||
        club.mainOrganizer.equals(user._id) ||
        club.organizers.some(id => id.equals(user._id))
    );
}

async function handleRegisterEvent(req, res) {
    try {
        const { eventId } = req.params;

        if (!isValidId(eventId)) {
            return res.status(400).json({
                msg: "Invalid event ID"
            });
        }

        const now = new Date();
        const qrToken = crypto.randomUUID();

        // First fetch the event date to calculate QR expiry.
        const existingEvent = await Event.findOne({
            _id: eventId,
            status: "approved",
            eventDate: { $gt: now }
        }).select("eventDate");

        if (!existingEvent) {
            return res.status(404).json({
                msg: "Event not found or registration is closed"
            });
        }

        const tokenExpiresAt = new Date(
            existingEvent.eventDate.getTime() + 3 * 60 * 60 * 1000
        );

        // Atomically reserve a seat and prevent duplicate registration.
        const event = await Event.findOneAndUpdate(
            {
                _id: eventId,
                status: "approved",
                availableSeats: { $gt: 0 },
                eventDate: { $gt: now },
                registrations: {
                    $not: {
                        $elemMatch: {
                            user: req.user._id
                        }
                    }
                }
            },
            {
                $push: {
                    registrations: {
                        user: req.user._id,
                        registeredAt: now,
                        qrToken,
                        tokenExpiresAt,
                        attended: false,
                        scannedAt: null
                    }
                },
                $inc: {
                    availableSeats: -1
                }
            },
            {
                new: true,
                runValidators: true
            }
        ).populate("club", "name");

        if (!event) {
            return res.status(400).json({
                msg: "Registration failed. You may already be registered, the event may be full, or registration may be closed."
            });
        }

        const user = await User.findById(req.user._id)
            .select("name email");

        if (user) {
            sendRegistrationEmail(
                user,
                {
                    ...event.toObject(),
                    clubName: event.club?.name
                },
                qrToken
            ).catch(error => {
                console.error(
                    "Registration email failed:",
                    error.message
                );
            });
        }

        return res.status(200).json({
            msg: "Registered successfully! Check your email for the QR code."
        });

    } catch (error) {
        console.error("Event registration error:", error);

        return res.status(500).json({
            msg: "Unable to complete registration"
        });
    }
}

async function handleUnregisterEvent(req, res) {
    try {
        const { eventId } = req.params;

        if (!isValidId(eventId)) {
            return res.status(400).json({
                msg: "Invalid event ID"
            });
        }

        const now = new Date();

        // Only a registered user who has not checked in
        // can cancel before the event starts.
        const updatedEvent = await Event.findOneAndUpdate(
            {
                _id: eventId,
                eventDate: { $gt: now },
                status: "approved",
                registrations: {
                    $elemMatch: {
                        user: req.user._id,
                        attended: false
                    }
                }
            },
            {
                $pull: {
                    registrations: {
                        user: req.user._id,
                        attended: false
                    }
                },
                $inc: {
                    availableSeats: 1
                }
            },
            {
                new: true
            }
        ).populate("club", "name");

        if (!updatedEvent) {
            return res.status(400).json({
                msg: "Unregistration failed. You may not be registered, may already be checked in, or registration may be closed."
            });
        }

        const user = await User.findById(req.user._id)
            .select("name email");

        if (user) {
            sendCancellationEmail(
                user,
                {
                    ...updatedEvent.toObject(),
                    clubName: updatedEvent.club?.name
                }
            ).catch(error => {
                console.error(
                    "Cancellation email failed:",
                    error.message
                );
            });
        }

        return res.status(200).json({
            msg: "Unregistered successfully"
        });

    } catch (error) {
        console.error("Event unregistration error:", error);

        return res.status(500).json({
            msg: "Unable to cancel registration"
        });
    }
}

async function handleScanAttendance(req, res) {
    try {
        const token = typeof req.body.token === "string"
            ? req.body.token.trim()
            : "";

        if (!token) {
            return res.status(400).json({
                msg: "QR token is required"
            });
        }

        const now = new Date();

        const event = await Event.findOne({
            "registrations.qrToken": token
        })
            .populate("registrations.user", "name email")
            .populate("club", "mainOrganizer organizers isActive");

        if (!event) {
            return res.status(404).json({
                msg: "Invalid QR code"
            });
        }

        // Do not allow attendance for cancelled or unapproved events.
        if (event.status !== "approved") {
            return res.status(400).json({
                msg: "Attendance is not available for this event"
            });
        }

        if (!event.club || !event.club.isActive) {
            return res.status(400).json({
                msg: "This event's club is inactive"
            });
        }

        // Important: only the event's own organizers or an admin
        // can scan its attendance QR codes.
        if (!isAuthorized(req.user, event.club)) {
            return res.status(403).json({
                msg: "You are not authorized to scan this event's QR codes"
            });
        }

        const registration = event.registrations.find(
            item => item.qrToken === token
        );

        if (!registration || !registration.user) {
            return res.status(404).json({
                msg: "Registration not found"
            });
        }

        if (registration.attended) {
            return res.status(409).json({
                msg: "Already checked in",
                user: registration.user.name,
                scannedAt: registration.scannedAt
            });
        }

        if (
            !registration.tokenExpiresAt ||
            registration.tokenExpiresAt <= now
        ) {
            return res.status(410).json({
                msg: "QR code has expired"
            });
        }

        // Atomic update prevents simultaneous scans from
        // marking the same registration twice.
        const result = await Event.updateOne(
            {
                _id: event._id,
                status: "approved",
                registrations: {
                    $elemMatch: {
                        qrToken: token,
                        attended: false,
                        tokenExpiresAt: { $gt: now }
                    }
                }
            },
            {
                $set: {
                    "registrations.$.attended": true,
                    "registrations.$.scannedAt": now
                }
            }
        );

        if (result.modifiedCount !== 1) {
            return res.status(409).json({
                msg: "QR code has already been used or has expired"
            });
        }

        return res.status(200).json({
            msg: "Check-in successful",
            user: registration.user.name,
            email: registration.user.email,
            event: event.title,
            scannedAt: now
        });

    } catch (error) {
        console.error("Attendance scan error:", error);

        return res.status(500).json({
            msg: "Unable to process QR check-in"
        });
    }
}

async function handleGetMyRegistrations(req, res) {
    try {
        const events = await Event.find({
            "registrations.user": req.user._id
        })
            .select(
                "title description image eventDate location totalSeats availableSeats status registrations"
            )
            .populate("club", "name")
            .sort({ eventDate: 1 });

        const result = events.map(event => {
            const myRegistration = event.registrations.find(
                item => item.user.equals(req.user._id)
            );

            return {
                _id: event._id,
                title: event.title,
                description: event.description,
                image: event.image,
                eventDate: event.eventDate,
                location: event.location,
                status: event.status,
                club: event.club,
                attended: myRegistration?.attended ?? false,
                registeredAt: myRegistration?.registeredAt
            };
        });

        return res.status(200).json({
            msg: "My registrations fetched successfully",
            events: result
        });

    } catch (error) {
        console.error("Fetch registrations error:", error);

        return res.status(500).json({
            msg: "Unable to fetch registrations"
        });
    }
}

async function handleGetEventAttendees(req, res) {
    try {
        const { eventId } = req.params;

        if (!isValidId(eventId)) {
            return res.status(400).json({
                msg: "Invalid event ID"
            });
        }

        const event = await Event.findById(eventId)
            .populate("registrations.user", "name email")
            .populate("club", "mainOrganizer organizers isActive");

        if (!event) {
            return res.status(404).json({
                msg: "Event not found"
            });
        }

        if (!isAuthorized(req.user, event.club)) {
            return res.status(403).json({
                msg: "Access denied"
            });
        }

        const attendees = event.registrations.map(registration => ({
            user: registration.user,
            registeredAt: registration.registeredAt,
            attended: registration.attended,
            scannedAt: registration.scannedAt
        }));

        return res.status(200).json({
            msg: "Attendees fetched successfully",
            total: attendees.length,
            checkedIn: attendees.filter(
                item => item.attended
            ).length,
            attendees
        });

    } catch (error) {
        console.error("Fetch attendees error:", error);

        return res.status(500).json({
            msg: "Unable to fetch attendees"
        });
    }
}

module.exports = {
    handleRegisterEvent,
    handleUnregisterEvent,
    handleScanAttendance,
    handleGetMyRegistrations,
    handleGetEventAttendees
};
