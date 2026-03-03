const express = require("express");
const router = express.Router();

const {
  handleCreateClub,
  handleAddOrganizer,
  handleGetAllUsers,
  handleChangeUserRole,
  handleDeactivateClub,
  handleReactivateClub,
  handleGetAllClubs,
  handleGetAllEvents,
  handleApproveEvent,
  handleRejectEvent,
} = require("../controllers/adminController");

const { checkAuth } = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");


/*
====================================
        CLUB MANAGEMENT
====================================
*/

// Create new club
router.post(
  "/club/create",
  checkAuth,
roleMiddleware.checkRole(["admin"]),
  handleCreateClub
);

// Add organizer to club
router.post(
  "/club/add-organizer",
  checkAuth,
  roleMiddleware.checkRole(["admin"]),
  handleAddOrganizer
);

// Get all clubs
router.get(
  "/clubs",
  checkAuth,
roleMiddleware.checkRole(["admin"]),
  handleGetAllClubs
);

// Deactivate club
router.put(
  "/club/deactivate/:clubId",
  checkAuth,
roleMiddleware.checkRole(["admin"]),
  handleDeactivateClub
);

// Reactivate club
router.put(
  "/club/reactivate/:clubId",
  checkAuth,
  roleMiddleware.checkRole(["admin"]),
  handleReactivateClub
);



/*
====================================
        USER MANAGEMENT
====================================
*/

// View all users
router.get(
  "/users",
  checkAuth,
 roleMiddleware.checkRole(["admin"]),
  handleGetAllUsers
);

// Change user role
router.put(
  "/user/role",
  checkAuth,
 roleMiddleware.checkRole(["admin"]),
  handleChangeUserRole
);



/*
====================================
        EVENT MANAGEMENT
====================================
*/

// View all events
router.get(
  "/events",
  checkAuth,
 roleMiddleware.checkRole(["admin"]),
  handleGetAllEvents
);

// Approve event
router.put(
  "/event/approve/:eventId",
  checkAuth,
roleMiddleware.checkRole(["admin"]),
  handleApproveEvent
);

// Reject event
router.put(
  "/event/reject/:eventId",
  checkAuth,
 roleMiddleware.checkRole(["admin"]),
  handleRejectEvent
);


module.exports = router;