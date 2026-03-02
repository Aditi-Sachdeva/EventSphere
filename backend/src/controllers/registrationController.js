const mongoose = require("mongoose");
const Event = require("../models/Event");
const Club = require("../models/Club");

async function handleRegisterEvent(req, res) {
    try {
        const { eventId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ msg: "Invalid event ID" });
        }

        const updatedEvent = await Event.findOneAndUpdate(
            {
                _id: eventId,
                availableSeats: { $gt: 0 },
                status: "upcoming",
                eventDate: { $gt: new Date() },
                "registrations.user": { $ne: req.user._id }
            },
            {
                $push: { registrations: { user: req.user._id, registeredAt: new Date() } },
                $inc: { availableSeats: -1 }
            },
            { new: true }
            
        );

        if (!updatedEvent) {
            return res.status(400).json({ msg: "Registration failed (duplicate, full, cancelled, or past event)" });
        }

        return res.status(200).json({ msg: "Registered successfully", event: updatedEvent });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server Error" });
    }
}


async function handleUnregisterEvent(req, res) {
    try {
        const { eventId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ msg: "Invalid event ID" });
        }

        const updatedEvent = await Event.findOneAndUpdate(
            {
                _id: eventId,
                status: "upcoming",
                eventDate: { $gt: new Date() },
                "registrations.user": req.user._id
            },
            {
                $pull: { registrations: { user: req.user._id } },
                $inc: { availableSeats: 1 }
            },
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(400).json({ msg: "Unregistration failed (not registered, cancelled, or past event)" });
        }

        return res.status(200).json({ msg: "Unregistered successfully", event: updatedEvent });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server Error" });
    }
}


async function handleGetMyRegistrations(req, res) {
    try {
        const events = await Event.find({ "registrations.user": req.user._id })
            .select("title description image eventDate location totalSeats availableSeats status")
            .populate("club", "name")
            .sort({ eventDate: 1 });

        return res.status(200).json({ msg: "My registrations fetched successfully", events });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server Error" });
    }
}


async function handleGetEventAttendees(req, res) {
    try {
        const { eventId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ msg: "Invalid event ID" });
        }

        const event = await Event.findById(eventId)
            .populate("registrations.user", "name email")
            .populate("club", "mainOrganizer organizers");

        if (!event) {
            return res.status(404).json({ msg: "Event not found" });
        }

        // Authorization check
        const isAuthorized =
            req.user.role === "admin" ||
            event.club.mainOrganizer.equals(req.user._id) ||
            event.club.organizers.some(id => id.equals(req.user._id));

        if (!isAuthorized) {
            return res.status(403).json({ msg: "Access denied" });
        }

        return res.status(200).json({
            msg: "Event attendees fetched successfully",
            attendees: event.registrations
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server Error" });
    }
}

module.exports = {
    handleRegisterEvent,
    handleUnregisterEvent,
    handleGetMyRegistrations,
    handleGetEventAttendees
};


