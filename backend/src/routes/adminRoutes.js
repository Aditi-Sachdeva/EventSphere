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
  handleDeleteUser
} = require("../controllers/adminController");




// Club management
router.post("/club/create",  handleCreateClub);
router.post("/club/add-organizer",  handleAddOrganizer);

router.get("/clubs", handleGetAllClubs);

router.put("/club/deactivate/:clubId",  handleDeactivateClub);
router.put("/club/reactivate/:clubId", handleReactivateClub);


// User management
router.get("/users", handleGetAllUsers);
router.put("/user/role", handleChangeUserRole);
router.delete("/user/:id", handleDeleteUser);


// Event management
router.get("/events", handleGetAllEvents);
router.put("/event/approve/:eventId",  handleApproveEvent);
router.put("/event/reject/:eventId",  handleRejectEvent);

module.exports = router;