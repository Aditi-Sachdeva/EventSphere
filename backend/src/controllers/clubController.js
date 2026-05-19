const Club = require('./../models/Club');
const User = require('./../models/User');
const { sendMemberApprovalEmail } = require('../utils/sendMemberApprovalEmail');

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
        const clubs = await Club.find(
            { isActive: true },
            "name description isActive"
        );

        return res.status(200).json({
            msg: "Active clubs fetched successfully",
            clubs,
        });
    } catch (error) {
        console.error(error);
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

        // Send approval email — fire and forget
        User.findById(userId)
            .select("name email")
            .then(approvedUser => {
                if (approvedUser) {
                    sendMemberApprovalEmail(approvedUser, club)
                        .catch(err => console.error("📧 Approval email failed:", err.message));
                }
            });

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


async function handleGetClubById(req, res) {
    try {
        const { clubId } = req.params;

        const club = await Club.findById(clubId)
            .populate("mainOrganizer", "name email")
            .populate("organizers", "name email");

        if (!club) {
            return res.status(404).json({ msg: "Club not found" });
        }

        const approvedMemberCount = club.members.filter(
            (m) => m.status === "approved"
        ).length;

        let membershipStatus = null;
        if (req.user) {
            const existing = club.members.find((m) =>
                m.user.equals(req.user._id)
            );
            if (existing) {
                membershipStatus = existing.status;
            }
        }

        return res.status(200).json({
            msg: "Club fetched successfully",
            club: {
                _id: club._id,
                name: club.name,
                description: club.description,
                isActive: club.isActive,
                mainOrganizer: club.mainOrganizer,
                organizers: club.organizers,
                approvedMemberCount,
                createdAt: club.createdAt,
            },
            membershipStatus,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server Error" });
    }
}


async function handleGetPendingMembers(req, res) {
    try {
        const { clubId } = req.params;

        const club = await Club.findById(clubId)
            .populate("members.user", "name email");

        if (!club) {
            return res.status(404).json({ msg: "Club not found" });
        }

        const isAuthorized =
            req.user.role === "admin" ||
            club.mainOrganizer.equals(req.user._id) ||
            club.organizers.some(id => id.equals(req.user._id));

        if (!isAuthorized) {
            return res.status(403).json({ msg: "Access denied" });
        }

        const pending = club.members.filter(m => m.status === "pending");
        const approved = club.members.filter(m => m.status === "approved");

        return res.status(200).json({
            msg: "Members fetched successfully",
            pending,
            approved,
            clubName: club.name,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server Error" });
    }
}


async function handleGetMyClubs(req, res) {
    try {
        const clubs = await Club.find(
            {
                "members.user": req.user._id,
                "members.status": "approved",
            },
            "name description isActive"
        );

        return res.status(200).json({
            msg: "My clubs fetched successfully",
            clubs,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
}

module.exports = {
    handleJoinClub,
    handleGetPublicClubs,
    handleApproveMember,
    handleRemoveMember,
    handleGetClubById,
    handleGetPendingMembers,
    handleGetMyClubs,
};