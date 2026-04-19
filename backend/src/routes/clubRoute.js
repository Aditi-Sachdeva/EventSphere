const express = require("express");
const router = express.Router();//FOR KEEPING FILES ORGANIZED IN SEPARATE FILES

const { handleGetPublicClubs } = require("../controllers/clubController");

router.get('/allClubs',handleGetPublicClubs);

module.exports = router;

