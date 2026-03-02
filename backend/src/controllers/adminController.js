
const Club = require('./../models/Club');
const User = require('./../models/User');

async function handleCreateClub(req, res) {

    try {
        const { name, description, mainOrganizerId } = req.body;

        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Admin access required" });
        }

        if (!name || !description || !mainOrganizerId) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const clubExists = await Club.findOne({ name });
        if (clubExists) {
            return res.status(400).json({ msg: "Club already exists" });
        }

        const user = await User.findById(mainOrganizerId);
        if (!user) {
            return res.status(404).json({ msg: "User does not exists" });
        }

        if (user.role === "user") {
            user.role = "organizer";
            await user.save();
        }

        const club = await Club.create({
            name,
            description,
            mainOrganizer: user._id,
            organizers: [user._id]
        });

        return res.status(201).json({ msg: "Club Created Successfully", club });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server Error" });
    }
}


async function handleAddOrganizer(req, res) {

    try {

        const { clubId, userId } = req.body;

        if (!clubId || !userId) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ msg: "Club does not exist" });
        }

        if (!club.isActive) {
            return res.status(400).json({ msg: "Club is inactive" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User does not exist" });
        }

        if (req.user.role !== "admin" && !club.mainOrganizer.equals(req.user._id)) {
            return res.status(403).json({ msg: "Access Required" });
        }

        if (club.organizers.some(id => id.equals(user._id))) {
            return res.status(400).json({ msg: "Already an orgainzer" });
        }

        if (user.role === "user") {
            user.role = "organizer";
            await user.save();
        }

        club.organizers.push(userId);
        await club.save();

        return res.status(200).json({ msg: "Organizer added successfully", club });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server Error" });
    }
}


async function handleGetAllUsers(req, res) {

    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Admin access required" });
        }

        const users = await User.find().select("-password");

        return res.status(200).json({ msg: "Users fetched successfully", users });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server Error" });
    }
}


async function handleChangeUserRole(req, res) {

    try {
        const { userId, newRole } = req.body;

        if (!userId || !newRole) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Admin access required" });
        }

        const allowedRoles = ["user", "organizer", "admin"];
        if (!allowedRoles.includes(newRole)) {
            return res.status(400).json({ msg: "Invalid role" });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ msg: "User does not exist" });
        }

        if (user.role !== newRole) {
            user.role = newRole;
            await user.save();
        }


        return res.status(200).json({ msg: "User role updated successfully", user });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server Error" });
    }
}


async function handleDeactivateClub(req, res) {
    try {
        const { clubId } = req.body;

        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Admin access required" });
        }

        if (!clubId) {
            return res.status(400).json({ msg: "clubId is required" });
        }

        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ msg: "Club not found" });
        }

        if (!club.isActive) {
            return res.status(400).json({ msg: "Club is already deactivated" });
        }

        club.isActive = false;
        await club.save();

        return res.status(200).json({ msg: "Club deactivated successfully", club });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server Error" });
    }
}


async function handleReactivateClub(req, res) {
    try {
        const { clubId } = req.body;

        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Admin access required" });
        }

        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ msg: "Club not found" });
        }

        if (club.isActive) {
            return res.status(400).json({ msg: "Club already active" });
        }

        club.isActive = true;
        await club.save();
        

        return res.status(200).json({ msg: "Club reactivated", club });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server Error" });
    }
}


module.exports = {
    handleCreateClub,
    handleAddOrganizer,
    handleGetAllUsers,
    handleChangeUserRole,
    handleDeactivateClub,
    handleReactivateClub,
};


