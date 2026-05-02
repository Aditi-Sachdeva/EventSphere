
const express = require('express');
const {handleSignup, handleLogin} = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: {
        msg: "Too many login attempts. Please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});


router.post('/signup', handleSignup);
router.post('/login',loginLimiter, handleLogin);



module.exports = router;