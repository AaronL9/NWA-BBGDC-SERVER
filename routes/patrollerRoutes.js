const express = require("express");
const router = express.Router();

const {
  patrollerLogin,
  authorizePatroller,
} = require("../controller/patrollerController.js");
const { verifyToken } = require("../middleware/requireAuth");

router.post("/login", patrollerLogin);

router.use(verifyToken);
router.get("/authroize", authorizePatroller);

module.exports = router;
