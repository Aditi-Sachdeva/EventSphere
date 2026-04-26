const express = require("express");
const router = express.Router();
const {
  handleCreateEvent,
  handleEditEvent,
  handleCancelEvent,
  handleViewEvent,
  handleGetAllEvents,
  handleGetClubEvents,
  handleGetMyEvents
} = require("../controllers/eventController");

const {
  handleRegisterEvent,
  handleUnregisterEvent,
  handleGetMyRegistrations,
  handleGetEventAttendees
} = require("../controllers/registrationController");

const { checkAuth } = require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/roleMiddleware");

router.get('/allEvents', handleGetAllEvents);

// router.get("/me", checkAuth, handleGetMyEvents);
router.get("/me", checkAuth, handleGetMyRegistrations);

router.post("/", checkAuth,checkRole(["admin"]), handleCreateEvent);

router.patch("/:eventId", checkAuth, handleEditEvent);

router.patch("/:eventId/cancel", checkAuth, handleCancelEvent);

router.get("/:eventId",handleViewEvent);

router.get("/", handleGetAllEvents);

router.get("/club/:clubId", handleGetClubEvents);


router.post("/:eventId/register", checkAuth, handleRegisterEvent);


router.patch("/:eventId/unregister", checkAuth, handleUnregisterEvent);

// Get attendees of a specific event
// router.get("/:eventId/attendees", checkAuth, handleGetEventAttendees);

module.exports = router;



