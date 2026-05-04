const Event = require("./../models/Event");
const Club = require("./../models/Club");
const mongoose = require("mongoose");

function isAuthorized(user, club) {
    return (
        user.role === "admin" ||
        club.mainOrganizer.equals(user._id) ||
        club.organizers.some(id => id.equals(user._id))
    );
}

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

async function handleCreateEvent(req, res) {
    try {
        const { title, description, eventDate, location, totalSeats, image } = req.body;

        if (!title || !description || !eventDate || !location || !totalSeats) {
            return res.status(400).json({ msg: "All required fields must be provided" });
        }

        const seats = Number(totalSeats);
        if (isNaN(seats) || seats < 1) {
            return res.status(400).json({ msg: "Invalid total seats" });
        }

        const eventTime = new Date(eventDate);
        if (isNaN(eventTime.getTime())) {
            return res.status(400).json({ msg: "Invalid event date format" });
        }
        if (eventTime <= new Date()) {
            return res.status(400).json({ msg: "Event date and time must be in the future" });
        }

        console.log("req.user:", req.user);

        const club = await Club.findById(req.user.club);
        if (!club || !club.isActive) {
            return res.status(404).json({ msg: "Club not found or inactive" });
        }

        if (!club.mainOrganizer.equals(req.user._id) &&
            !club.organizers.some(id => id.equals(req.user._id))) {
            return res.status(403).json({ msg: "Access denied" });
        }

        const event = await Event.create({
            title,
            description,
            club: club._id,
            createdBy: req.user._id,
            eventDate: eventTime,
            location,
            image: image || null,
            totalSeats: seats,
            availableSeats: seats,
            status: "upcoming"
        });

        return res.status(201).json({ msg: "Event created successfully", event });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
}

async function handleEditEvent(req, res) {
    try {
        const { eventId } = req.params;
        const { title, description, eventDate, location, totalSeats, image } = req.body;

        if (!isValidId(eventId)) {
            return res.status(400).json({ msg: "Invalid event ID" });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ msg: "Event not found" });
        }

        if (event.status === "cancelled") {
            return res.status(400).json({ msg: "Cannot edit a cancelled event" });
        }

        if (event.eventDate <= new Date()) {
            return res.status(400).json({ msg: "Cannot edit past events" });
        }

        const club = await Club.findById(event.club);
        if (!club || !club.isActive) {
            return res.status(404).json({ msg: "Club not found or inactive" });
        }

        if (!isAuthorized(req.user, club)) {
            return res.status(403).json({ msg: "Access denied" });
        }

        if (eventDate) {
            const newDate = new Date(eventDate);

            if (isNaN(newDate.getTime())) {
                return res.status(400).json({ msg: "Invalid event date format" });
            }

            if (newDate <= new Date()) {
                return res.status(400).json({ msg: "Event date must be in the future" });
            }

            event.eventDate = newDate;
        }

        if (totalSeats !== undefined) {
            const seats = Number(totalSeats);

            if (isNaN(seats) || seats < 1) {
                return res.status(400).json({ msg: "Invalid total seats" });
            }

            if (seats < event.registrations.length) {
                return res.status(400).json({
                    msg: "Total seats cannot be less than already registered users"
                });
            }

            event.totalSeats = seats;
            event.availableSeats = seats - event.registrations.length;
        }

        if (title) event.title = title;
        if (description) event.description = description;
        if (location) event.location = location;
        if (image !== undefined) event.image = image;

        await event.save();

        return res.status(200).json({ msg: "Event updated successfully", event });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
}

async function handleCancelEvent(req, res) {
    try {
        const { eventId } = req.params;

        if (!isValidId(eventId)) {
            return res.status(400).json({ msg: "Invalid event ID" });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ msg: "Event not found" });
        }

        if (event.status === "cancelled") {
            return res.status(400).json({ msg: "Event is already cancelled" });
        }

        if (event.eventDate <= new Date()) {
            return res.status(400).json({ msg: "Cannot cancel past events" });
        }

        const club = await Club.findById(event.club);
        if (!club || !club.isActive) {
            return res.status(404).json({ msg: "Club not found or inactive" });
        }

        if (!isAuthorized(req.user, club)) {
            return res.status(403).json({ msg: "Access denied" });
        }

        event.status = "cancelled";
        await event.save();

        return res.status(200).json({ msg: "Event cancelled successfully", event });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
}

async function handleViewEvent(req, res) {
    try {
        const { eventId } = req.params;

        if (!isValidId(eventId)) {
            return res.status(400).json({ msg: "Invalid event ID" });
        }

        const event = await Event.findOne({
            _id: eventId,
            status: "approved"
        })
            .select("title description image eventDate location totalSeats availableSeats status registrations")
            .populate("club", "name")
            .populate("createdBy", "name");

        if (!event) {
            return res.status(404).json({ msg: "Event not found" });
        }

        const isRegistered = req.user
            ? event.registrations.some(r => r.user.equals(req.user._id))
            : false;

        return res.status(200).json({
            event,
            isRegistered
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
}

async function handleGetAllEvents(req, res) {
    try {
        const events = await Event.find({
            status: "approved",
            eventDate: { $gt: new Date() }
        })
            .select("title description image eventDate location totalSeats availableSeats status club")
            .populate({
                path: "club",
                select: "name isActive",
                match: { isActive: true }
            })
            .sort({ eventDate: 1 });

        const activeClubEvents = events.filter(ev => ev.club);

        return res.status(200).json({
            msg: "Upcoming events fetched successfully",
            events: activeClubEvents
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
}



async function handleGetClubEvents(req, res) {
    try {
        const { clubId } = req.params;

        if (!isValidId(clubId)) {
            return res.status(400).json({ msg: "Invalid club ID" });
        }

        const events = await Event.find({ club: clubId })
            .select("title description image eventDate location totalSeats availableSeats status registrations")
            .populate("club", "name")
            .sort({ eventDate: 1 });

        return res.status(200).json({ msg: "Club events fetched successfully", events });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
}


async function handleGetMyEvents(req, res) {
    try {
        const events = await Event.find({
            "registrations.user": req.user._id,
            status: "upcoming",
            eventDate: { $gt: new Date() }
        })
            .select("title description image eventDate location totalSeats availableSeats status")
            .populate("club", "name")
            .sort({ eventDate: 1 });

        return res.status(200).json({ msg: "My upcoming events fetched successfully", events });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
}

module.exports = {
    handleCreateEvent,
    handleEditEvent,
    handleCancelEvent,
    handleViewEvent,
    handleGetAllEvents,
    handleGetClubEvents,
    handleGetMyEvents,
};



