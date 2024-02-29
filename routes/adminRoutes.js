const express = require("express");
const router = express.Router();

const {
  setAdmin,
  addPatrollerByPhoneNumber,
} = require("../controller/adminController");
const { verifyAdminToken } = require("../middleware/requireAuth");

router.post("/custom_claim", setAdmin);

router.use(verifyAdminToken);
router.post("/add_patroller", addPatrollerByPhoneNumber);

module.exports = router;
