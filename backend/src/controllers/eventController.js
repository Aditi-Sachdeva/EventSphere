
const Event = require("../models/Event");
const Club = require("../models/Club");
const mongoose = require("mongoose");

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

async function handleCreateEvent(req, res) {
    try {
        const {
            title,
            description,
            eventDate,
            location,
            totalSeats,
            image
        } = req.body;

        if (
            typeof title !== "string" ||
            !title.trim() ||
            typeof description !== "string" ||
            !description.trim() ||
            !eventDate ||
            typeof location !== "string" ||
            !location.trim() ||
            totalSeats === undefined
        ) {
            return res.status(400).json({
                msg: "All required fields must be provided"
            });
        }

        const seats = Number(totalSeats);

        if (!Number.isInteger(seats) || seats < 1) {
            return res.status(400).json({
                msg: "Total seats must be a positive integer"
            });
        }

        const eventTime = new Date(eventDate);

        if (Number.isNaN(eventTime.getTime())) {
            return res.status(400).json({
                msg: "Invalid event date format"
            });
        }

        if (eventTime <= new Date()) {
            return res.status(400).json({
                msg: "Event date and time must be in the future"
            });
        }

        if (image !== undefined && image !== null &&
            typeof image !== "string") {
            return res.status(400).json({
                msg: "Invalid event image"
            });
        }

        const club = await Club.findById(req.user.club);

        if (!club || !club.isActive) {
            return res.status(404).json({
                msg: "Club not found or inactive"
            });
        }

        if (!isAuthorized(req.user, club)) {
            return res.status(403).json({
                msg: "Access denied"
            });
        }

        const event = await Event.create({
            title: title.trim(),
            description: description.trim(),
            club: club._id,
            createdBy: req.user._id,
            eventDate: eventTime,
            location: location.trim(),
            image: image || null,
            totalSeats: seats,
            availableSeats: seats,
            status: "pending"
        });

        return res.status(201).json({
            msg: "Event created successfully. Awaiting admin approval.",
            event
        });

    } catch (error) {
        console.error("Create event error:", error);

        return res.status(500).json({
            msg: "Unable to create event"
        });
    }
}

async function handleEditEvent(req, res) {
    try {
        const { eventId } = req.params;

        const {
            title,
            description,
            eventDate,
            location,
            totalSeats,
            image
        } = req.body;

        if (!isValidId(eventId)) {
            return res.status(400).json({
                msg: "Invalid event ID"
            });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                msg: "Event not found"
            });
        }

        if (["cancelled", "completed", "rejected"].includes(event.status)) {
            return res.status(400).json({
                msg: "This event cannot be edited"
            });
        }

        if (event.eventDate <= new Date()) {
            return res.status(400).json({
                msg: "Cannot edit past events"
            });
        }

        const club = await Club.findById(event.club);

        if (!club || !club.isActive) {
            return res.status(404).json({
                msg: "Club not found or inactive"
            });
        }

        if (!isAuthorized(req.user, club)) {
            return res.status(403).json({
                msg: "Access denied"
            });
        }

        if (title !== undefined) {
            if (typeof title !== "string" || !title.trim()) {
                return res.status(400).json({
                    msg: "Invalid event title"
                });
            }

            event.title = title.trim();
        }

        if (description !== undefined) {
            if (typeof description !== "string" || !description.trim()) {
                return res.status(400).json({
                    msg: "Invalid event description"
                });
            }

            event.description = description.trim();
        }

        if (location !== undefined) {
            if (typeof location !== "string" || !location.trim()) {
                return res.status(400).json({
                    msg: "Invalid event location"
                });
            }

            event.location = location.trim();
        }

        if (eventDate !== undefined) {
            const newDate = new Date(eventDate);

            if (
                Number.isNaN(newDate.getTime()) ||
                newDate <= new Date()
            ) {
                return res.status(400).json({
                    msg: "Event date must be a valid future date"
                });
            }

            event.eventDate = newDate;
        }

        if (totalSeats !== undefined) {
            const seats = Number(totalSeats);

            if (!Number.isInteger(seats) || seats < 1) {
                return res.status(400).json({
                    msg: "Invalid total seats"
                });
            }

            if (seats < event.registrations.length) {
                return res.status(400).json({
                    msg: "Total seats cannot be less than registered users"
                });
            }

            event.totalSeats = seats;
            event.availableSeats = seats - event.registrations.length;
        }

        if (image !== undefined) {
            if (image !== null && typeof image !== "string") {
                return res.status(400).json({
                    msg: "Invalid event image"
                });
            }

            event.image = image;
        }

        // An edit to an already approved event requires reapproval.
        if (event.status === "approved") {
            event.status = "pending";
        }

        await event.save();

        return res.status(200).json({
            msg: "Event updated successfully. It may require admin approval again.",
            event
        });

    } catch (error) {
        console.error("Edit event error:", error);

        return res.status(500).json({
            msg: "Unable to update event"
        });
    }
}

async function handleCancelEvent(req, res) {
    try {
        const { eventId } = req.params;

        if (!isValidId(eventId)) {
            return res.status(400).json({
                msg: "Invalid event ID"
            });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                msg: "Event not found"
            });
        }

        if (event.status === "cancelled") {
            return res.status(400).json({
                msg: "Event is already cancelled"
            });
        }

        if (event.eventDate <= new Date()) {
            return res.status(400).json({
                msg: "Cannot cancel past events"
            });
        }

        const club = await Club.findById(event.club);

        if (!club || !club.isActive) {
            return res.status(404).json({
                msg: "Club not found or inactive"
            });
        }

        if (!isAuthorized(req.user, club)) {
            return res.status(403).json({
                msg: "Access denied"
            });
        }

        event.status = "cancelled";

        await event.save();

        return res.status(200).json({
            msg: "Event cancelled successfully",
            event
        });

    } catch (error) {
        console.error("Cancel event error:", error);

        return res.status(500).json({
            msg: "Unable to cancel event"
        });
    }
}

async function handleViewEvent(req, res) {
    try {
        const { eventId } = req.params;

        if (!isValidId(eventId)) {
            return res.status(400).json({
                msg: "Invalid event ID"
            });
        }

        const event = await Event.findOne({
            _id: eventId,
            status: "approved"
        })
            .select(
                "title description image eventDate location totalSeats availableSeats status club createdBy"
            )
            .populate("club", "name")
            .populate("createdBy", "name");

        if (!event) {
            return res.status(404).json({
                msg: "Event not found"
            });
        }

        const isRegistered = await Event.exists({
            _id: eventId,
            "registrations.user": req.user._id
        });

        return res.status(200).json({
            event,
            isRegistered: Boolean(isRegistered)
        });

    } catch (error) {
        console.error("View event error:", error);

        return res.status(500).json({
            msg: "Unable to fetch event"
        });
    }
}

async function handleGetAllEvents(req, res) {
    try {
        const events = await Event.find({
            status: "approved",
            eventDate: { $gt: new Date() }
        })
            .select(
                "title description image eventDate location totalSeats availableSeats status club"
            )
            .populate({
                path: "club",
                select: "name isActive",
                match: { isActive: true }
            })
            .sort({ eventDate: 1 });

        return res.status(200).json({
            msg: "Upcoming events fetched successfully",
            events: events.filter(event => event.club)
        });

    } catch (error) {
        console.error("Fetch events error:", error);

        return res.status(500).json({
            msg: "Unable to fetch events"
        });
    }
}

async function handleGetClubEvents(req, res) {
    try {
        const { clubId } = req.params;

        if (!isValidId(clubId)) {
            return res.status(400).json({
                msg: "Invalid club ID"
            });
        }

        const club = await Club.findById(clubId);

        if (!club || !club.isActive) {
            return res.status(404).json({
                msg: "Club not found or inactive"
            });
        }

        const events = await Event.find({
            club: clubId,
            status: "approved"
        })
            .select(
                "title description image eventDate location totalSeats availableSeats status club"
            )
            .populate("club", "name")
            .sort({ eventDate: 1 });

        return res.status(200).json({
            msg: "Club events fetched successfully",
            events
        });

    } catch (error) {
        console.error("Fetch club events error:", error);

        return res.status(500).json({
            msg: "Unable to fetch club events"
        });
    }
}

async function handleGetMyEvents(req, res) {
    try {
        const events = await Event.find({
            "registrations.user": req.user._id,
            status: "approved",
            eventDate: { $gt: new Date() }
        })
            .select(
                "title description image eventDate location totalSeats availableSeats status club"
            )
            .populate("club", "name")
            .sort({ eventDate: 1 });

        return res.status(200).json({
            msg: "My upcoming events fetched successfully",
            events
        });

    } catch (error) {
        console.error("Fetch my events error:", error);

        return res.status(500).json({
            msg: "Unable to fetch your events"
        });
    }
}

module.exports = {
    handleCreateEvent,
    handleEditEvent,
    handleCancelEvent,
    handleViewEvent,
    handleGetAllEvents,
    handleGetClubEvents,
    handleGetMyEvents
};
