
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function checkAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                msg: "No token provided"
            });
        }

        const token = authHeader.slice(7).trim();

        if (!token) {
            return res.status(401).json({
                msg: "No token provided"
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured");

            return res.status(500).json({
                msg: "Authentication is not configured"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!decoded.id) {
            return res.status(401).json({
                msg: "Invalid token payload"
            });
        }

        const user = await User.findById(decoded.id)
            .select("_id name email role club");

        if (!user) {
            return res.status(401).json({
                msg: "User account no longer exists"
            });
        }

        req.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            club: user.club || null
        };

        return next();

    } catch (error) {
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                msg: "Invalid or expired token"
            });
        }

        console.error("Authentication error:", error);

        return res.status(500).json({
            msg: "Authentication failed"
        });
    }
}

module.exports = { checkAuth };
