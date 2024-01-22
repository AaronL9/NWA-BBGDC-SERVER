const express = require("express");
const router = express.Router();

const { setAdmin, addPatroller } = require("../controller/adminController");

router.get("/custom_claim", setAdmin);
router.post("/add_patroller", addPatroller);

module.exports = router;
