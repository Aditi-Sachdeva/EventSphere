
const Club = require('./../models/Club');

async function handleJoinClub(req, res) {
    try {
        const { clubId } = req.body;

        if (!clubId) {
            return res.status(400).json({ msg: "clubId required" });
        }

        const club = await Club.findById(clubId);
        if (!club || !club.isActive) {
            return res.status(404).json({ msg: "Club not available" });
        }

        const exists = club.members.find(m =>
            m.user.equals(req.user._id)
        );

        if (exists) {
            if (exists.status === "pending") {
                return res.status(400).json({ msg: "Already requested, awaiting approval" });
            }
            if (exists.status === "approved") {
                return res.status(400).json({ msg: "Already a member" });
            }
        }

        club.members.push({
            user: req.user._id,
            status: "pending"
        });

        await club.save();

        res.status(200).json({ msg: "Join request sent" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server Error" });
    }
}


async function handleGetPublicClubs(req, res) {
  try {
    const clubs = await Club.find({}, "name description isActive");

    return res.status(200).json({
      msg: "Clubs fetched successfully",
      clubs,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error" });
  }
}


async function handleApproveMember(req, res) {
    try {
        const { clubId, userId } = req.body;

        if (!clubId || !userId) {
            return res.status(400).json({ msg: "clubId and userId are required" });
        }

        const club = await Club.findById(clubId);
        if (!club || !club.isActive) {
            return res.status(404).json({ msg: "Club not found or inactive" });
        }

        const isAuthorized =
            req.user.role === "admin" ||
            club.mainOrganizer.equals(req.user._id) ||
            club.organizers.some(id => id.equals(req.user._id));

        if (!isAuthorized) {
            return res.status(403).json({ msg: "Access denied" });
        }

        if (club.mainOrganizer.equals(userId)) {
            return res.status(400).json({ msg: "Cannot modify main organizer" });
        }

        const member = club.members.find(m => m.user.equals(userId));
        if (!member) {
            return res.status(404).json({ msg: "Membership not found" });
        }

        if (member.status === "approved") {
            return res.status(400).json({ msg: "Already approved" });
        }

        member.status = "approved";
        await club.save();

        return res.status(200).json({ msg: "Member approved successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server Error" });
    }
}


async function handleRemoveMember(req, res) {
    try {
        const { clubId, userId } = req.body;

        if (!clubId || !userId) {
            return res.status(400).json({ msg: "clubId and userId are required" });
        }

        const club = await Club.findById(clubId);
        if (!club || !club.isActive) {
            return res.status(404).json({ msg: "Club not found or inactive" });
        }

        const isAuthorized =
            req.user.role === "admin" ||
            club.mainOrganizer.equals(req.user._id) ||
            club.organizers.some(id => id.equals(req.user._id));

        if (!isAuthorized) {
            return res.status(403).json({ msg: "Access denied" });
        }

        if (club.mainOrganizer.equals(userId)) {
            return res.status(400).json({ msg: "Cannot remove main organizer" });
        }

        if (club.organizers.some(id => id.equals(userId))) {
            return res.status(400).json({ msg: "Cannot remove an organizer via member removal" });
        }

        const membershipIndex = club.members.findIndex(m => m.user.equals(userId));
        if (membershipIndex === -1) {
            return res.status(404).json({ msg: "Member not found" });
        }

        club.members.splice(membershipIndex, 1);
        await club.save();

        return res.status(200).json({ msg: "Member removed successfully", club });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server Error" });
    }
}


module.exports = {
    handleJoinClub,
    handleGetPublicClubs,
    handleApproveMember,
    handleRemoveMember,
}



