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
router.get("/me", checkAuth, handleGetMyRegistrations);

router.post("/", checkAuth, handleCreateEvent);
router.patch("/:eventId", checkAuth, handleEditEvent);
router.patch("/:eventId/cancel", checkAuth, handleCancelEvent);
router.get("/:eventId",checkAuth,handleViewEvent);
router.get("/", handleGetAllEvents);

router.get("/club/:clubId",checkAuth, handleGetClubEvents);
router.post("/:eventId/register", checkAuth, handleRegisterEvent);
router.patch("/:eventId/unregister", checkAuth, handleUnregisterEvent);

module.exports = router;



