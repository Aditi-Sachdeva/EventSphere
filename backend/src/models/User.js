
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({//SCHEMA DEFINES HOW DATA WILL BE STORED
    name: {
        type: String,
        required: true,
        trim: true,//REMOVE EXTRA SPACES
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
    }

}, { timestamps: true });


const User = mongoose.model("User",userSchema);

module.exports = User;