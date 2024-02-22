const express = require("express");
const router = express.Router();

const {
  setAdmin,
  addPatroller,
  sendNotification,
} = require("../controller/adminController");
const { verifyAdminToken } = require("../middleware/requireAuth");

router.use(verifyAdminToken);

router.get("/custom_claim", setAdmin);
router.post("/add_patroller", addPatroller);

module.exports = router;
