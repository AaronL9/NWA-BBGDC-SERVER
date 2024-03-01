const express = require("express");
const router = express.Router();

const {
  sendChatNotification,
  alertAllPatrollers,
  sendChatNotificationToAdmin,
  alertAllAdmin,
} = require("../controller/notificationController");
const { verifyToken } = require("../middleware/requireAuth");

router.use(verifyToken);
router.get("/alert-admins", alertAllAdmin);
router.get("/alert", alertAllPatrollers);
router.post("/notify-admin", sendChatNotificationToAdmin);
router.post("/chat-notification", sendChatNotification);

module.exports = router;
