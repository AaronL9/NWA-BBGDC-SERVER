const express = require("express");
const router = express.Router();

const {
  setAdmin,
  addPatrollerByPhoneNumber,
  changeUserStatus,
  deletePatroller,
} = require("../controller/adminController");
const { verifyAdminToken } = require("../middleware/requireAuth");

router.post("/custom_claim", setAdmin);

router.use(verifyAdminToken);
router.post("/add_patroller", addPatrollerByPhoneNumber);
router.post("/change-user-status", changeUserStatus);
router.delete("/delete_patroller", deletePatroller);

module.exports = router;
