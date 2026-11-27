
const mongoose = require("mongoose");

async function connectDb() {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI is not configured");
    }

    mongoose.set("strictQuery", true);

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000
        });

        console.log("MongoDB connected successfully");

        return mongoose.connection;
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
}

module.exports = { connectDb };
