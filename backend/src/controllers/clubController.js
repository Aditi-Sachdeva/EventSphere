
const mongoose = require("mongoose");

const Club = require("../models/Club");
const User = require("../models/User");

const {
    sendMemberApprovalEmail
} = require("../utils/sendMemberApprovalEmail");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

function isClubAuthorized(user, club) {
    if (!user || !club) return false;

    return (
        user.role === "admin" ||
        club.mainOrganizer.equals(user._id) ||
        club.organizers.some(id => id.equals(user._id))
    );
}

async function handleJoinClub(req, res) {
    try {
        const { clubId } = req.body;

        if (!clubId || !isValidId(clubId)) {
            return res.status(400).json({
                msg: "Valid club ID is required"
            });
        }

        const club = await Club.findOne({
            _id: clubId,
            isActive: true
        });

        if (!club) {
            return res.status(404).json({
                msg: "Club not available"
            });
        }

        if (club.mainOrganizer.equals(req.user._id) ||
            club.organizers.some(id => id.equals(req.user._id))) {
            return res.status(400).json({
                msg: "You are already an organizer of this club"
            });
        }

        const existingMembership = club.members.find(
            member => member.user.equals(req.user._id)
        );

        if (existingMembership) {
            if (existingMembership.status === "pending") {
                return res.status(409).json({
                    msg: "Already requested, awaiting approval"
                });
            }

            if (existingMembership.status === "approved") {
                return res.status(409).json({
                    msg: "Already a member"
                });
            }
        }

        club.members.push({
            user: req.user._id,
            status: "pending"
        });

        await club.save();

        return res.status(200).json({
            msg: "Join request sent"
        });

    } catch (error) {
        console.error("Join club error:", error);

        return res.status(500).json({
            msg: "Unable to send club join request"
        });
    }
}

async function handleGetPublicClubs(req, res) {
    try {
        const clubs = await Club.find({
            isActive: true
        })
            .select("name description isActive createdAt")
            .sort({ name: 1 });

        return res.status(200).json({
            msg: "Active clubs fetched successfully",
            clubs
        });

    } catch (error) {
        console.error("Get public clubs error:", error);

        return res.status(500).json({
            msg: "Unable to fetch clubs"
        });
    }
}

async function handleApproveMember(req, res) {
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

        if (!club || !club.isActive) {
            return res.status(404).json({
                msg: "Club not found or inactive"
            });
        }

        if (!isClubAuthorized(req.user, club)) {
            return res.status(403).json({
                msg: "Access denied"
            });
        }

        if (club.mainOrganizer.equals(userId)) {
            return res.status(400).json({
                msg: "Cannot modify main organizer"
            });
        }

        if (club.organizers.some(id => id.equals(userId))) {
            return res.status(400).json({
                msg: "User is already an organizer"
            });
        }

        const member = club.members.find(
            item => item.user.equals(userId)
        );

        if (!member) {
            return res.status(404).json({
                msg: "Membership request not found"
            });
        }

        if (member.status === "approved") {
            return res.status(409).json({
                msg: "Already approved"
            });
        }

        const approvedUser = await User.findById(userId)
            .select("name email");

        if (!approvedUser) {
            return res.status(404).json({
                msg: "User does not exist"
            });
        }

        member.status = "approved";

        await club.save();

        // Do not fail the membership approval if email delivery fails.
        sendMemberApprovalEmail(approvedUser, club)
            .catch(error => {
                console.error(
                    "Membership approval email failed:",
                    error.message
                );
            });

        return res.status(200).json({
            msg: "Member approved successfully"
        });

    } catch (error) {
        console.error("Approve member error:", error);

        return res.status(500).json({
            msg: "Unable to approve member"
        });
    }
}

async function handleRemoveMember(req, res) {
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

        if (!club || !club.isActive) {
            return res.status(404).json({
                msg: "Club not found or inactive"
            });
        }

        if (!isClubAuthorized(req.user, club)) {
            return res.status(403).json({
                msg: "Access denied"
            });
        }

        if (club.mainOrganizer.equals(userId)) {
            return res.status(400).json({
                msg: "Cannot remove main organizer"
            });
        }

        if (club.organizers.some(id => id.equals(userId))) {
            return res.status(400).json({
                msg: "Cannot remove an organizer via member removal"
            });
        }

        const membershipIndex = club.members.findIndex(
            member => member.user.equals(userId)
        );

        if (membershipIndex === -1) {
            return res.status(404).json({
                msg: "Member not found"
            });
        }

        club.members.splice(membershipIndex, 1);

        await club.save();

        return res.status(200).json({
            msg: "Member removed successfully",
            club
        });

    } catch (error) {
        console.error("Remove member error:", error);

        return res.status(500).json({
            msg: "Unable to remove member"
        });
    }
}

async function handleGetClubById(req, res) {
    try {
        const { clubId } = req.params;

        if (!isValidId(clubId)) {
            return res.status(400).json({
                msg: "Invalid club ID"
            });
        }

        const club = await Club.findById(clubId)
            .populate("mainOrganizer", "name email")
            .populate("organizers", "name email");

        if (!club || !club.isActive) {
            return res.status(404).json({
                msg: "Club not found"
            });
        }

        const approvedMemberCount = club.members.filter(
            member => member.status === "approved"
        ).length;

        const existingMembership = club.members.find(
            member => member.user.equals(req.user._id)
        );

        const membershipStatus = existingMembership
            ? existingMembership.status
            : null;

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
                createdAt: club.createdAt
            },
            membershipStatus
        });

    } catch (error) {
        console.error("Get club error:", error);

        return res.status(500).json({
            msg: "Unable to fetch club"
        });
    }
}

async function handleGetPendingMembers(req, res) {
    try {
        const { clubId } = req.params;

        if (!isValidId(clubId)) {
            return res.status(400).json({
                msg: "Invalid club ID"
            });
        }

        const club = await Club.findById(clubId)
            .populate("members.user", "name email");

        if (!club) {
            return res.status(404).json({
                msg: "Club not found"
            });
        }

        if (!isClubAuthorized(req.user, club)) {
            return res.status(403).json({
                msg: "Access denied"
            });
        }

        const pending = club.members.filter(
            member => member.status === "pending"
        );

        const approved = club.members.filter(
            member => member.status === "approved"
        );

        return res.status(200).json({
            msg: "Members fetched successfully",
            pending,
            approved,
            clubName: club.name
        });

    } catch (error) {
        console.error("Get club members error:", error);

        return res.status(500).json({
            msg: "Unable to fetch club members"
        });
    }
}

async function handleGetMyClubs(req, res) {
    try {
        const clubs = await Club.find({
            isActive: true,
            members: {
                $elemMatch: {
                    user: req.user._id,
                    status: "approved"
                }
            }
        })
            .select("name description isActive createdAt")
            .sort({ name: 1 });

        return res.status(200).json({
            msg: "My clubs fetched successfully",
            clubs
        });

    } catch (error) {
        console.error("Get my clubs error:", error);

        return res.status(500).json({
            msg: "Unable to fetch your clubs"
        });
    }
}

module.exports = {
    handleJoinClub,
    handleGetPublicClubs,
    handleApproveMember,
    handleRemoveMember,
    handleGetClubById,
    handleGetPendingMembers,
    handleGetMyClubs
};
