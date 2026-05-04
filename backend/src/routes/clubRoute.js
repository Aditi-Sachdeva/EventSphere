const express = require("express");
const router = express.Router();

const {
    handleJoinClub,
    handleGetPublicClubs,
    handleApproveMember,
    handleRemoveMember,
    handleGetClubById,
    handleGetPendingMembers,
    handleGetMyClubs,
} = require("../controllers/clubController");

const { checkAuth } = require("../middlewares/authMiddleware");

router.get('/allClubs', handleGetPublicClubs);
router.get("/me", checkAuth, handleGetMyClubs);       
router.post('/join', checkAuth, handleJoinClub);
router.post('/approve', checkAuth, handleApproveMember);
router.post('/remove', checkAuth, handleRemoveMember);
router.get('/:clubId/pending', checkAuth, handleGetPendingMembers);
router.get('/:clubId', checkAuth, handleGetClubById);  // after


module.exports = router;