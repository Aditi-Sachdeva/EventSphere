const express = require("express");
const rateLimit = require("express-rate-limit");

const {
    handleSignup,
    handleLogin,
    handleLogout
} = require("../controllers/authController");

const { checkAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        msg: "Too many attempts. Please try again after 15 minutes."
    }
});

router.post("/signup", authLimiter, handleSignup);
router.post("/login", authLimiter, handleLogin);
router.post("/logout", checkAuth, handleLogout);

module.exports = router;