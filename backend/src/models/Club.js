
const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved"],
        default: "pending",
    },
}, { timestamps: true, _id: false });

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    mainOrganizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    organizers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    members: [membershipSchema],
    isActive: {
        type: Boolean,
        default: true,
    }

}, { timestamps: true });

const Club = mongoose.model("Club", clubSchema);//MONGOOSE MODEL IS CREARED NOW WE CAN PERFORM CONTROLLER OPERATIONS USING THIS LIKE CLIB.FIND();

module.exports = Club;