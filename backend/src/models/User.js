const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "organizer", "admin"],
        default: "user",
    },
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
        default: null,
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
