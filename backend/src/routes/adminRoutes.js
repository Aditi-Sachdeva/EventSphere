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
const { checkRole } = require("../middlewares/roleMiddleware");


// Club management
router.post("/club/create", checkAuth, checkRole(["admin"]), handleCreateClub);
router.post("/club/add-organizer", checkAuth, checkRole(["admin"]), handleAddOrganizer);
router.get("/clubs", checkAuth, checkRole(["admin"]), handleGetAllClubs);
router.put("/club/deactivate/:clubId", checkAuth, checkRole(["admin"]), handleDeactivateClub);
router.put("/club/reactivate/:clubId", checkAuth, checkRole(["admin"]), handleReactivateClub);


// User management
router.get("/users", checkAuth, checkRole(["admin"]), handleGetAllUsers);
router.put("/user/role", checkAuth, checkRole(["admin"]), handleChangeUserRole);


// Event management
router.get("/events", checkAuth, checkRole(["admin"]), handleGetAllEvents);
router.put("/event/approve/:eventId", checkAuth, checkRole(["admin"]), handleApproveEvent);
router.put("/event/reject/:eventId", checkAuth, checkRole(["admin"]), handleRejectEvent);


module.exports = router;