
const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    registeredAt: {
        type: Date,
        default: Date.now
    },
    qrToken: {
        type: String,
        default: null
    },
    tokenExpiresAt: {
        type: Date,
        default: null
    },
    attended: {
        type: Boolean,
        default: false
    },
    scannedAt: {
        type: Date,
        default: null
    }
});

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        default: null
    },
    totalSeats: {
        type: Number,
        required: true,
        min: 1
    },
    availableSeats: {
        type: Number,
        required: true,
        min: 0
    },
    registrations: [registrationSchema],
    status: {
        type: String,
        enum: [
            "pending",
            "approved",
            "rejected",
            "upcoming",
            "completed",
            "cancelled"
        ],
        default: "pending"
    }
}, { timestamps: true });

eventSchema.index({ "registrations.qrToken": 1 });
eventSchema.index({ status: 1, eventDate: 1 });
eventSchema.index({ club: 1, eventDate: 1 });
eventSchema.index({ "registrations.user": 1 });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
