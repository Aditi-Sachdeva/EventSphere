
 



const express = require("express");
const router = express.Router();

const {
    handleJoinClub,
    handleGetPublicClubs,
    handleApproveMember,
    handleRemoveMember,
    handleGetClubById,
    handleGetPendingMembers,
} = require("../controllers/clubController");

const { checkAuth } = require("../middlewares/authMiddleware");

router.get('/allClubs', handleGetPublicClubs);
router.post('/join', checkAuth, handleJoinClub);
router.post('/approve', checkAuth, handleApproveMember);   // ← was missing
router.post('/remove', checkAuth, handleRemoveMember);     // ← was missing
router.get('/:clubId/pending', checkAuth, handleGetPendingMembers);
router.get('/:clubId', checkAuth, handleGetClubById);

module.exports = router;