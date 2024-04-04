const express = require("express");
const router = express.Router();

const {
  getSingleNews,
  checkPatrollerNumber,
  getDirection,
} = require("../controller/publicController");

router.post("/", getSingleNews);
router.post("/check-phone-number", checkPatrollerNumber);
router.post("/get-direction", getDirection);

module.exports = router;
