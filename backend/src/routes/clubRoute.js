const express = require("express");
const router = express.Router();

const { handleGetPublicClubs } = require("../controllers/clubController");

router.get('/allClubs',handleGetPublicClubs);

module.exports = router;

