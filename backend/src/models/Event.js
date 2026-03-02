
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const eventSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
        required: true,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    eventDate: {
        type: Date,
        required: true,
    },

    location: {
        type: String,
        required: true,
    },

    image: {
        type: String,   
        default: null
    },

    totalSeats: {
        type: Number,
        required: true,
        min: 1,
    },

    availableSeats: {
        type: Number,
        required: true,
        min: 0,
    },

    registrations: [registrationSchema],

    status: {
        type: String,
        enum: ["upcoming", "completed", "cancelled"],
        default: "upcoming",
    }

}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;

