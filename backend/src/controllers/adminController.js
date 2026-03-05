
const Club = require('./../models/Club');
const User = require('./../models/User');
const Event = require('./../models/Event');

async function handleCreateClub(req, res) {

  try {

    const { name, description, mainOrganizerId } = req.body;

    if (!name || !description || !mainOrganizerId) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const clubExists = await Club.findOne({ name });
    if (clubExists) {
      return res.status(400).json({ msg: "Club already exists" });
    }

    const user = await User.findById(mainOrganizerId);
    if (!user) {
      return res.status(404).json({ msg: "User does not exist" });
    }

    if (user.role === "user") {
      user.role = "organizer";
      await user.save();
    }

    const club = await Club.create({
      name,
      description,
      mainOrganizer: user._id,
      organizers: [user._id],
      isActive: true
    });

    return res.status(201).json({ msg: "Club Created Successfully", club });

  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
}



async function handleGetAllClubs(req, res) {

  try {

    const clubs = await Club.find()
      .populate("mainOrganizer", "name email")
      .populate("organizers", "name email");

    return res.status(200).json({ msg: "Clubs fetched successfully", clubs });

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

    if (club.organizers.some(id => id.equals(user._id))) {
      return res.status(400).json({ msg: "Already an organizer" });
    }

    if (user.role === "user") {
      user.role = "organizer";
      await user.save();
    }

    club.organizers.push(user._id);
    await club.save();

    return res.status(200).json({ msg: "Organizer added successfully", club });

  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
}


async function handleDeactivateClub(req, res) {

  try {

    const { clubId } = req.params;

    if (!clubId) {
      return res.status(400).json({ msg: "Club ID is required" });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ msg: "Club not found" });
    }

    if (!club.isActive) {
      return res.status(400).json({ msg: "Club already deactivated" });
    }

    club.isActive = false;
    await club.save();

    return res.status(200).json({ msg: "Club deactivated successfully", club });

  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
}


async function handleReactivateClub(req, res) {

  try {

    const { clubId } = req.params;

    if (!clubId) {
      return res.status(400).json({ msg: "Club ID is required" });
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

    return res.status(200).json({ msg: "Club reactivated successfully", club });

  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
}


async function handleGetAllUsers(req, res) {

  try {

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

  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
}


async function handleGetAllEvents(req, res) {

  try {

    const events = await Event.find()
      .populate("createdBy", "name email")
      .populate("club", "name isActive");

    return res.status(200).json({ msg: "Events fetched successfully", events });

  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
}


async function handleApproveEvent(req, res) {

  try {

    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ msg: "Event ID is required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    if (event.status === "approved") {
      return res.status(400).json({ msg: "Event already approved" });
    }

    if (event.status === "rejected") {
      return res.status(400).json({ msg: "Rejected event cannot be approved" });
    }

    event.status = "approved";
    await event.save();

    return res.status(200).json({ msg: "Event approved successfully", event });

  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
}


async function handleRejectEvent(req, res) {

  try {

    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ msg: "Event ID is required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    if (event.status === "rejected") {
      return res.status(400).json({ msg: "Event already rejected" });
    }

    if (event.status === "approved") {
      return res.status(400).json({ msg: "Approved event cannot be rejected" });
    }

    event.status = "rejected";
    await event.save();

    return res.status(200).json({ msg: "Event rejected successfully", event });

  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
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

};

