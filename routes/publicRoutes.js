const express = require("express");
const router = express.Router();

const {
  getSingleNews,
  checkPatrollerNumber,
} = require("../controller/publicController");

router.post("/", getSingleNews);
router.post("/check-phone-number", checkPatrollerNumber);

module.exports = router;
