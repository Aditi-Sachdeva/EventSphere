
const express = require("express");

const router = express.Router();//FOR KEEPING FILES ORGANIZED IN SEPARATE FILES


 
const {
    handleJoinClub,
    handleGetPublicClubs,
    handleApproveMember,
    handleRemoveMember,
    handleGetClubById,
} = require("../controllers/clubController");
 
const { checkAuth } = require("../middlewares/authMiddleware");
 
router.get('/allClubs', handleGetPublicClubs);
 router.post('/join', checkAuth, handleJoinClub);
// IMPORTANT: /allClubs must be defined BEFORE /:clubId
// otherwise Express matches "allClubs" as a clubId param


router.get('/:clubId', checkAuth, handleGetClubById);
 

 
module.exports = router;
 