
const mongoose = require("mongoose");

const Club = require("../models/Club");
const User = require("../models/User");
const Event = require("../models/Event");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const validRoles = ["user", "organizer", "admin"];

async function handleCreateClub(req, res) {
    try {
        const { name, description, mainOrganizerId } = req.body;

        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof description !== "string" ||
            !description.trim() ||
            !mainOrganizerId
        ) {
            return res.status(400).json({
                msg: "All fields are required"
            });
        }

        if (!isValidId(mainOrganizerId)) {
            return res.status(400).json({
                msg: "Invalid organizer ID"
            });
        }

        const existingClub = await Club.findOne({
            name: name.trim()
        });

        if (existingClub) {
            return res.status(409).json({
                msg: "Club already exists"
            });
        }

        const user = await User.findById(mainOrganizerId);

        if (!user) {
            return res.status(404).json({
                msg: "User does not exist"
            });
        }

        if (user.club) {
            return res.status(409).json({
                msg: "This user is already associated with another club"
            });
        }

        const club = await Club.create({
            name: name.trim(),
            description: description.trim(),
            mainOrganizer: user._id,
            organizers: [user._id],
            isActive: true
        });

        user.club = club._id;

        if (user.role === "user") {
            user.role = "organizer";
        }

        await user.save();

        return res.status(201).json({
            msg: "Club Created Successfully",
            club
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                msg: "Club already exists"
            });
        }

        console.error("Create club error:", error);

        return res.status(500).json({
            msg: "Unable to create club"
        });
    }
}

async function handleGetAllClubs(req, res) {
    try {
        const clubs = await Club.find()
            .populate("mainOrganizer", "name email")
            .populate("organizers", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            msg: "Clubs fetched successfully",
            clubs
        });

    } catch (error) {
        console.error("Get clubs error:", error);

        return res.status(500).json({
            msg: "Unable to fetch clubs"
        });
    }
}

async function handleAddOrganizer(req, res) {
    try {
        const { clubId, userId } = req.body;

        if (!clubId || !userId) {
            return res.status(400).json({
                msg: "Club ID and user ID are required"
            });
        }

        if (!isValidId(clubId) || !isValidId(userId)) {
            return res.status(400).json({
                msg: "Invalid club or user ID"
            });
        }

        const club = await Club.findById(clubId);

        if (!club) {
            return res.status(404).json({
                msg: "Club does not exist"
            });
        }

        if (!club.isActive) {
            return res.status(400).json({
                msg: "Club is inactive"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                msg: "User does not exist"
            });
        }

        if (club.organizers.some(id => id.equals(user._id))) {
            return res.status(409).json({
                msg: "Already an organizer"
            });
        }

        if (user.club && !user.club.equals(club._id)) {
            return res.status(409).json({
                msg: "User is already associated with another club"
            });
        }

        club.organizers.push(user._id);

        user.club = club._id;

        if (user.role === "user") {
            user.role = "organizer";
        }

        await Promise.all([
            club.save(),
            user.save()
        ]);

        const updatedClub = await Club.findById(club._id)
            .populate("mainOrganizer", "name email")
            .populate("organizers", "name email");

        return res.status(200).json({
            msg: "Organizer added successfully",
            club: updatedClub
        });

    } catch (error) {
        console.error("Add organizer error:", error);

        return res.status(500).json({
            msg: "Unable to add organizer"
        });
    }
}

async function handleDeactivateClub(req, res) {
    try {
        const { clubId } = req.params;

        if (!isValidId(clubId)) {
            return res.status(400).json({
                msg: "Invalid club ID"
            });
        }

        const club = await Club.findById(clubId);

        if (!club) {
            return res.status(404).json({
                msg: "Club not found"
            });
        }

        if (!club.isActive) {
            return res.status(400).json({
                msg: "Club already deactivated"
            });
        }

        club.isActive = false;
        await club.save();

        return res.status(200).json({
            msg: "Club deactivated successfully",
            club
        });

    } catch (error) {
        console.error("Deactivate club error:", error);

        return res.status(500).json({
            msg: "Unable to deactivate club"
        });
    }
}

async function handleReactivateClub(req, res) {
    try {
        const { clubId } = req.params;

        if (!isValidId(clubId)) {
            return res.status(400).json({
                msg: "Invalid club ID"
            });
        }

        const club = await Club.findById(clubId);

        if (!club) {
            return res.status(404).json({
                msg: "Club not found"
            });
        }

        if (club.isActive) {
            return res.status(400).json({
                msg: "Club already active"
            });
        }

        club.isActive = true;
        await club.save();

        return res.status(200).json({
            msg: "Club reactivated successfully",
            club
        });

    } catch (error) {
        console.error("Reactivate club error:", error);

        return res.status(500).json({
            msg: "Unable to reactivate club"
        });
    }
}

async function handleGetAllUsers(req, res) {
    try {
        const users = await User.find()
            .select("-password")
            .populate("club", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            msg: "Users fetched successfully",
            users
        });

    } catch (error) {
        console.error("Get users error:", error);

        return res.status(500).json({
            msg: "Unable to fetch users"
        });
    }
}

async function handleChangeUserRole(req, res) {
    try {
        const { userId, newRole } = req.body;

        if (!userId || !newRole) {
            return res.status(400).json({
                msg: "User ID and new role are required"
            });
        }

        if (!isValidId(userId)) {
            return res.status(400).json({
                msg: "Invalid user ID"
            });
        }

        if (!validRoles.includes(newRole)) {
            return res.status(400).json({
                msg: "Invalid role"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                msg: "User does not exist"
            });
        }

        if (user._id.equals(req.user._id) && newRole !== "admin") {
            return res.status(400).json({
                msg: "You cannot remove your own admin role"
            });
        }

        if (user.role === newRole) {
            return res.status(200).json({
                msg: "User already has this role",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }

        // A club's main organizer cannot be demoted without
        // first transferring club ownership.
        if (newRole !== "organizer" && user.club) {
            const club = await Club.findById(user.club);

            if (club && club.mainOrganizer.equals(user._id)) {
                return res.status(400).json({
                    msg: "Transfer main organizer responsibility before changing this role"
                });
            }
        }

        user.role = newRole;
        await user.save();

        return res.status(200).json({
            msg: "User role updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                club: user.club
            }
        });

    } catch (error) {
        console.error("Change user role error:", error);

        return res.status(500).json({
            msg: "Unable to update user role"
        });
    }
}

async function handleGetAllEvents(req, res) {
    try {
        const events = await Event.find()
            .select(
                "title description eventDate location image totalSeats availableSeats status club createdBy registrations createdAt"
            )
            .populate("createdBy", "name email")
            .populate("club", "name isActive")
            .sort({ createdAt: -1 });

        // Never expose QR tokens to the admin dashboard.
        const safeEvents = events.map(event => {
            const data = event.toObject();

            data.registrationCount = event.registrations.length;

            data.attendedCount = event.registrations.filter(
                registration => registration.attended
            ).length;

            delete data.registrations;

            return data;
        });

        return res.status(200).json({
            msg: "Events fetched successfully",
            events: safeEvents
        });

    } catch (error) {
        console.error("Get events error:", error);

        return res.status(500).json({
            msg: "Unable to fetch events"
        });
    }
}

async function handleApproveEvent(req, res) {
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

        if (event.status === "approved") {
            return res.status(400).json({
                msg: "Event already approved"
            });
        }

        if (event.status === "rejected") {
            return res.status(400).json({
                msg: "Rejected event cannot be approved"
            });
        }

        if (event.status === "cancelled" || event.status === "completed") {
            return res.status(400).json({
                msg: "This event cannot be approved"
            });
        }

        if (event.eventDate <= new Date()) {
            return res.status(400).json({
                msg: "Cannot approve an event whose date has passed"
            });
        }

        const club = await Club.findById(event.club);

        if (!club || !club.isActive) {
            return res.status(400).json({
                msg: "The event's club is unavailable or inactive"
            });
        }

        event.status = "approved";
        await event.save();

        return res.status(200).json({
            msg: "Event approved successfully",
            event
        });

    } catch (error) {
        console.error("Approve event error:", error);

        return res.status(500).json({
            msg: "Unable to approve event"
        });
    }
}

async function handleRejectEvent(req, res) {
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

        if (event.status === "rejected") {
            return res.status(400).json({
                msg: "Event already rejected"
            });
        }

        if (event.status === "approved") {
            return res.status(400).json({
                msg: "Approved event cannot be rejected"
            });
        }

        if (["cancelled", "completed"].includes(event.status)) {
            return res.status(400).json({
                msg: "This event cannot be rejected"
            });
        }

        event.status = "rejected";
        await event.save();

        return res.status(200).json({
            msg: "Event rejected successfully",
            event
        });

    } catch (error) {
        console.error("Reject event error:", error);

        return res.status(500).json({
            msg: "Unable to reject event"
        });
    }
}

async function handleDeleteUser(req, res) {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({
                msg: "Invalid user ID"
            });
        }

        if (id === req.user._id.toString()) {
            return res.status(400).json({
                msg: "You cannot delete your own account"
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        // Do not leave deleted users in club membership/organizer lists.
        await Club.updateMany(
            {},
            {
                $pull: {
                    members: { user: user._id },
                    organizers: user._id
                }
            }
        );

        // Restore seats for future events where the user had
        // registered but had not checked in.
        const registeredEvents = await Event.find({
            "registrations.user": user._id
        });

        for (const event of registeredEvents) {
            const registration = event.registrations.find(
                item => item.user.equals(user._id)
            );

            if (registration && !registration.attended &&
                event.eventDate > new Date()) {
                event.availableSeats = Math.min(
                    event.totalSeats,
                    event.availableSeats + 1
                );
            }

            event.registrations = event.registrations.filter(
                item => !item.user.equals(user._id)
            );

            await event.save();
        }

        await User.findByIdAndDelete(user._id);

        return res.status(200).json({
            msg: "User deleted successfully"
        });

    } catch (error) {
        console.error("Delete user error:", error);

        return res.status(500).json({
            msg: "Unable to delete user"
        });
    }
}

module.exports = {
    handleCreateClub,
    handleGetAllClubs,
    handleAddOrganizer,
    handleDeactivateClub,
    handleReactivateClub,
    handleGetAllUsers,
    handleChangeUserRole,
    handleGetAllEvents,
    handleApproveEvent,
    handleRejectEvent,
    handleDeleteUser
};
