const express = require("express");
const router = express.Router();

const { getSingleNews } = require("../controller/publicController");

router.post("/", getSingleNews);

module.exports = router;
