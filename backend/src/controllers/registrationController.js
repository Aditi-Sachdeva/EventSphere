const crypto = require("crypto");
const mongoose = require("mongoose");
const Event = require("../models/Event");
const User = require("../models/User");
const { sendRegistrationEmail } = require("../utils/sendRegistrationEmail");

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

function isAuthorized(user, club) {
    return (
        user.role === "admin" ||
        club.mainOrganizer.equals(user._id) ||
        club.organizers.some(id => id.equals(user._id))
    );
}

// ─── POST /api/event/:eventId/register ───────────────────────────────────────
async function handleRegisterEvent(req, res) {
    try {
        const { eventId } = req.params;

        if (!isValidId(eventId)) {
            return res.status(400).json({ msg: "Invalid event ID" });
        }

        const qrToken = crypto.randomUUID();

        const event = await Event.findOneAndUpdate(
            {
                _id: eventId,
                status: "approved",
                availableSeats: { $gt: 0 },
                eventDate: { $gt: new Date() },
                "registrations.user": { $ne: req.user._id },
            },
            {
                $push: {
                    registrations: {
                        user: req.user._id,
                        registeredAt: new Date(),
                        qrToken,
                        attended: false,
                        scannedAt: null,
                    },
                },
                $inc: { availableSeats: -1 },
            },
            { returnDocument: "after" }
        ).populate("club", "name");

        if (!event) {
            return res.status(400).json({
                msg: "Registration failed. Event may be full, already registered, cancelled, or past.",
            });
        }

        // Set tokenExpiresAt = event date + 3 hours
        const expiresAt = new Date(event.eventDate.getTime() + 3 * 60 * 60 * 1000);
        await Event.updateOne(
            { _id: eventId, "registrations.qrToken": qrToken },
            { $set: { "registrations.$.tokenExpiresAt": expiresAt } }
        );

        // Send email — fire and forget
        const user = await User.findById(req.user._id).select("name email");
        sendRegistrationEmail(
            user,
            { ...event.toObject(), clubName: event.club?.name },
            qrToken
        ).catch(err => {
            console.error("📧 Email failed (non-fatal):", err.message);
            console.error("📧 Full error:", err);
        });

        return res.status(200).json({
            msg: "Registered successfully! Check your email for the QR code.",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
}

// ─── PATCH /api/event/:eventId/unregister ────────────────────────────────────
async function handleUnregisterEvent(req, res) {
    try {
        const { eventId } = req.params;

        if (!isValidId(eventId)) {
            return res.status(400).json({ msg: "Invalid event ID" });
        }

        const updatedEvent = await Event.findOneAndUpdate(
            {
                _id: eventId,
                eventDate: { $gt: new Date() },
                "registrations.user": req.user._id,
            },
            {
                $pull: { registrations: { user: req.user._id } },
                $inc: { availableSeats: 1 },
            },
            { returnDocument: "after" }
        );

        if (!updatedEvent) {
            return res.status(400).json({
                msg: "Unregistration failed. Not registered, or event is past/cancelled.",
            });
        }

        return res.status(200).json({ msg: "Unregistered successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
}

// ─── POST /api/event/attendance/scan ─────────────────────────────────────────
async function handleScanAttendance(req, res) {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ msg: "QR token is required" });
        }

        const event = await Event.findOne({ "registrations.qrToken": token })
            .populate("registrations.user", "name email");

        if (!event) {
            return res.status(404).json({ msg: "Invalid QR code" });
        }

        const reg = event.registrations.find(r => r.qrToken === token);

        if (!reg) {
            return res.status(404).json({ msg: "Registration not found" });
        }

        if (reg.attended) {
            return res.status(409).json({
                msg: "Already checked in",
                user: reg.user.name,
                scannedAt: reg.scannedAt,
            });
        }

        if (reg.tokenExpiresAt && reg.tokenExpiresAt < new Date()) {
            return res.status(410).json({ msg: "QR code has expired" });
        }

        await Event.updateOne(
            { _id: event._id, "registrations.qrToken": token },
            {
                $set: {
                    "registrations.$.attended": true,
                    "registrations.$.scannedAt": new Date(),
                },
            }
        );

        return res.status(200).json({
            msg: "Check-in successful ✓",
            user: reg.user.name,
            email: reg.user.email,
            event: event.title,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
}

// ─── GET /api/event/me ────────────────────────────────────────────────────────
async function handleGetMyRegistrations(req, res) {
    try {
        const events = await Event.find({ "registrations.user": req.user._id })
            .select("title description image eventDate location totalSeats availableSeats status registrations")
            .populate("club", "name")
            .sort({ eventDate: 1 });

        const result = events.map(ev => {
            const myReg = ev.registrations.find(r => r.user.equals(req.user._id));
            return {
                _id: ev._id,
                title: ev.title,
                description: ev.description,
                image: ev.image,
                eventDate: ev.eventDate,
                location: ev.location,
                status: ev.status,
                club: ev.club,
                attended: myReg?.attended ?? false,
                registeredAt: myReg?.registeredAt,
            };
        });

        return res.status(200).json({
            msg: "My registrations fetched successfully",
            events: result,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
}

// ─── GET /api/event/:eventId/attendees ───────────────────────────────────────
async function handleGetEventAttendees(req, res) {
    try {
        const { eventId } = req.params;

        if (!isValidId(eventId)) {
            return res.status(400).json({ msg: "Invalid event ID" });
        }

        const event = await Event.findById(eventId)
            .populate("registrations.user", "name email")
            .populate("club", "mainOrganizer organizers");

        if (!event) return res.status(404).json({ msg: "Event not found" });

        if (!isAuthorized(req.user, event.club)) {
            return res.status(403).json({ msg: "Access denied" });
        }

        return res.status(200).json({
            msg: "Attendees fetched successfully",
            total: event.registrations.length,
            checkedIn: event.registrations.filter(r => r.attended).length,
            attendees: event.registrations,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
}

module.exports = {
    handleRegisterEvent,
    handleUnregisterEvent,
    handleScanAttendance,
    handleGetMyRegistrations,
    handleGetEventAttendees,
};