const express = require("express");
const router = express.Router();

const {
  sendChatNotification,
  alertAllPatrollers,
  sendChatNotificationToAdmin,
} = require("../controller/notificationController");
const { verifyToken } = require("../middleware/requireAuth");

router.post("/notify-admin", sendChatNotificationToAdmin);
router.use(verifyToken);
router.get("/alert", alertAllPatrollers);
router.post("/chat-notification", sendChatNotification);

module.exports = router;
