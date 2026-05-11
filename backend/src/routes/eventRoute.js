// const express = require("express");
// const router = express.Router();
// const {
//   handleCreateEvent,
//   handleEditEvent,
//   handleCancelEvent,
//   handleViewEvent,
//   handleGetAllEvents,
//   handleGetClubEvents,
//   handleGetMyEvents
// } = require("../controllers/eventController");

// const {
//   handleRegisterEvent,
//   handleUnregisterEvent,
//   handleGetMyRegistrations,
//   handleGetEventAttendees
// } = require("../controllers/registrationController");

// const { checkAuth } = require("../middlewares/authMiddleware");
// const { checkRole } = require("../middlewares/roleMiddleware");

// router.get('/allEvents', handleGetAllEvents);
// router.get("/me", checkAuth, handleGetMyRegistrations);

// router.post("/", checkAuth, handleCreateEvent);
// router.patch("/:eventId", checkAuth, handleEditEvent);
// router.patch("/:eventId/cancel", checkAuth, handleCancelEvent);
// router.get("/:eventId",checkAuth,handleViewEvent);
// router.get("/", handleGetAllEvents);

// router.get("/club/:clubId",checkAuth, handleGetClubEvents);
// router.post("/:eventId/register", checkAuth, handleRegisterEvent);
// router.patch("/:eventId/unregister", checkAuth, handleUnregisterEvent);

// module.exports = router;






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
  handleGetEventAttendees,
  handleScanAttendance,          // ← added
} = require("../controllers/registrationController");

const { checkAuth } = require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/roleMiddleware");

// ── Static routes first ──────────────────────────────────────
router.get('/allEvents', handleGetAllEvents);
router.get("/me", checkAuth, handleGetMyRegistrations);
router.get("/club/:clubId", checkAuth, handleGetClubEvents);   // ← moved up (was below /:eventId)

// Scan — staff/admin only
router.post(                                                   // ← added
  "/attendance/scan",
  checkAuth,
  checkRole(["admin", "organizer", "mainOrganizer"]),
  handleScanAttendance
);

// ── Event CRUD ───────────────────────────────────────────────
router.post("/", checkAuth, handleCreateEvent);
router.patch("/:eventId", checkAuth, handleEditEvent);
router.patch("/:eventId/cancel", checkAuth, handleCancelEvent);
router.get("/:eventId", checkAuth, handleViewEvent);
router.get("/", handleGetAllEvents);

// ── Registration ─────────────────────────────────────────────
router.post("/:eventId/register", checkAuth, handleRegisterEvent);
router.patch("/:eventId/unregister", checkAuth, handleUnregisterEvent);
router.get("/:eventId/attendees", checkAuth, handleGetEventAttendees);  // ← added

module.exports = router;