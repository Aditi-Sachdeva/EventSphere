
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");

const { connectDb } = require("./src/config/db");

const app = express();

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
    app.set("trust proxy", 1);
}

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);

app.use(helmet());

app.use(
    morgan(isProduction ? "combined" : "dev")
);

app.use(
    cors({
        origin(origin, callback) {
            // Requests without an Origin header include Postman and
            // server-to-server requests.
            if (!origin) {
                return callback(null, true);
            }

            const normalizedOrigin = origin.replace(/\/+$/, "");

            if (allowedOrigins.includes(normalizedOrigin)) {
                return callback(null, true);
            }

            return callback(new Error("Origin is not allowed by CORS"));
        },
        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Root route
app.get("/", (req, res) => {
    res.status(200).json({
        msg: "EventSphere Backend is Running"
    });
});

// Health check
app.get("/health", (req, res) => {
    const databaseConnected = mongoose.connection.readyState === 1;

    res.status(databaseConnected ? 200 : 503).json({
        status: databaseConnected ? "ok" : "error",
        database: databaseConnected ? "connected" : "disconnected",
        timestamp: new Date().toISOString()
    });
});

// API routes
app.use("/api/auth", require("./src/routes/authRoute"));
app.use("/api/admin", require("./src/routes/adminRoute"));
app.use("/api/club", require("./src/routes/clubRoute"));
app.use("/api/event", require("./src/routes/eventRoute"));

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        msg: "Route not found"
    });
});

// Global error handler
app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    if (
        error instanceof SyntaxError &&
        error.status === 400 &&
        "body" in error
    ) {
        return res.status(400).json({
            msg: "Invalid JSON request body"
        });
    }

    if (error.message === "Origin is not allowed by CORS") {
        return res.status(403).json({
            msg: "Origin not allowed"
        });
    }

    console.error("Request error:", error);

    return res.status(500).json({
        msg: "Internal server error"
    });
});

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
    if (
        !process.env.JWT_SECRET ||
        process.env.JWT_SECRET.length < 32
    ) {
        throw new Error(
            "JWT_SECRET must contain at least 32 characters"
        );
    }

    await connectDb();

    const server = app.listen(PORT, "0.0.0.0", () => {
        console.log(`EventSphere backend running on port ${PORT}`);
    });

    // Graceful shutdown
    async function shutdown(signal) {
        console.log(`${signal} received. Shutting down...`);

        server.close(async () => {
            try {
                await mongoose.connection.close();
                console.log("MongoDB connection closed");
                process.exit(0);
            } catch (error) {
                console.error("Shutdown error:", error.message);
                process.exit(1);
            }
        });
    }

    process.once("SIGINT", () => shutdown("SIGINT"));
    process.once("SIGTERM", () => shutdown("SIGTERM"));
}

if (require.main === module) {
    startServer().catch((error) => {
        console.error("Unable to start EventSphere:", error.message);
        process.exit(1);
    });
}

module.exports = app;
