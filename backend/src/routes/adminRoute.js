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

const { checkAuth } = require("../middlewares/authMiddleware");
const { checkRole } = require('../middlewares/roleMiddleware');



router.post("/club/create",checkAuth,checkRole(["admin"]), handleCreateClub);
router.post("/club/add-organizer",checkAuth,checkRole(["admin"]),  handleAddOrganizer);
router.get("/clubs",checkAuth,checkRole(["admin"]), handleGetAllClubs);
router.put("/club/deactivate/:clubId",checkAuth,checkRole(["admin"]),  handleDeactivateClub);
router.put("/club/reactivate/:clubId",checkAuth,checkRole(["admin"]), handleReactivateClub);


router.get("/users",checkAuth,checkRole(["admin"]), handleGetAllUsers);
router.put("/user/role",checkAuth,checkRole(["admin"]), handleChangeUserRole);
router.delete("/user/:id",checkAuth,checkRole(["admin"]), handleDeleteUser);



router.get("/events",checkAuth,checkRole(["admin"]), handleGetAllEvents);

module.exports = router;


