const express = require("express");
const router = express.Router();

const {
  sendChatNotification,
  alertAllPatrollers,
  sendChatNotificationToAdmin,
} = require("../controller/notificationController");
const { verifyPatrollerToken } = require("../middleware/requireAuth");

router.use(verifyPatrollerToken);
router.get("/alert", alertAllPatrollers);
router.post("/notify-admin", sendChatNotificationToAdmin);
router.post("/chat-notification", sendChatNotification);

module.exports = router;
