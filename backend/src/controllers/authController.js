const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

function createToken(user) {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
            club: user.club || null
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
}

async function handleSignup(req, res) {
    try {
        const name = typeof req.body.name === "string"
            ? req.body.name.trim()
            : "";

        const email = typeof req.body.email === "string"
            ? req.body.email.trim().toLowerCase()
            : "";

        const password = typeof req.body.password === "string"
            ? req.body.password
            : "";

        if (!name || !email || !password) {
            return res.status(400).json({
                msg: "All fields are required"
            });
        }

        if (name.length > 80) {
            return res.status(400).json({
                msg: "Name must be 80 characters or fewer"
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                msg: "Invalid email format"
            });
        }

        if (!validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })) {
            return res.status(400).json({
                msg: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                msg: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user"
        });

        return res.status(201).json({
            msg: "User Created Successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                msg: "User already exists"
            });
        }

        console.error("Signup error:", error);

        return res.status(500).json({
            msg: "Server Error"
        });
    }
}

async function handleLogin(req, res) {
    try {
        const email = typeof req.body.email === "string"
            ? req.body.email.trim().toLowerCase()
            : "";

        const password = typeof req.body.password === "string"
            ? req.body.password
            : "";

        if (!email || !password) {
            return res.status(400).json({
                msg: "All fields are required"
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                msg: "Invalid email format"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                msg: "Invalid Credentials"
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                msg: "Invalid Credentials"
            });
        }

        const token = createToken(user);

        return res.status(200).json({
            msg: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                club: user.club
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            msg: "Server Error"
        });
    }
}

// JWT is stateless. The frontend must discard the token during logout.
async function handleLogout(req, res) {
    return res.status(200).json({
        msg: "Logout successful. Please discard your token."
    });
}

module.exports = {
    handleSignup,
    handleLogin,
    handleLogout
};