const express = require("express");
const router = express.Router();

const {
    handleCreateEvent,
    handleEditEvent,
    handleCancelEvent,
    handleViewEvent,
    handleGetAllEvents,
    handleGetClubEvents
} = require("../controllers/eventController");

const {
    handleRegisterEvent,
    handleUnregisterEvent,
    handleGetMyRegistrations,
    handleGetEventAttendees,
    handleScanAttendance
} = require("../controllers/registrationController");

const { checkAuth } = require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/roleMiddleware");

// Public event discovery.
router.get("/allEvents", handleGetAllEvents);
router.get("/", handleGetAllEvents);

// Authenticated user routes.
router.get("/me", checkAuth, handleGetMyRegistrations);
router.get("/club/:clubId", checkAuth, handleGetClubEvents);

// Only admins and organizers can scan attendance QR codes.
router.post(
    "/attendance/scan",
    checkAuth,
    checkRole(["admin", "organizer"]),
    handleScanAttendance
);

router.post("/", checkAuth, handleCreateEvent);
router.patch("/:eventId", checkAuth, handleEditEvent);
router.patch("/:eventId/cancel", checkAuth, handleCancelEvent);
router.get("/:eventId", checkAuth, handleViewEvent);

router.post("/:eventId/register", checkAuth, handleRegisterEvent);
router.patch("/:eventId/unregister", checkAuth, handleUnregisterEvent);
router.get("/:eventId/attendees", checkAuth, handleGetEventAttendees);

module.exports = router;