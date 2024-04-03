const { Expo } = require("expo-server-sdk");
const { admin } = require("../firebase/adminSdk");

const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
const db = admin.firestore();

const pushNotification = async (pushTokens, message) => {
  let messages = [];
  for (let pushToken of pushTokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }
    message.to = pushToken;
    messages.push(message);
  }

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.log(error);
      }
    }
  })();
};

const sendChatNotificationToAdmin = async (req, res) => {
  const { adminId } = req.body;
  try {
    const snapshot = await db.doc(`admin_push_token/${adminId}`).get();
    const data = snapshot.data();

    console.log(data.token);
    const message = {
      notification: {
        title: "New Message!",
        body: "you have new message from patroller",
      },
      token: data.token,
    };
    admin
      .messaging()
      .send(message)
      .then((response) => {
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
    res.status(200).json({ message: "notification pushed" });
  } catch (error) {
    res
      .status(400)
      .json({ error: `Error sending push notification: ${error.message}` });
  }
};

const sendChatNotification = async (req, res) => {
  const { patrollerId } = req.body;
  const message = {
    title: "New message!",
    sound: "default",
    body: "You have new message from admin",
    priority: "high",
  };

  try {
    const snapshot = await db.doc(`device_push_token/${patrollerId}`).get();
    const data = snapshot.data();

    const tokens = [data.token];
    await pushNotification(tokens, message);

    res.status(200).json({ message: "notification pushed" });
  } catch (error) {
    res
      .status(400)
      .json({ error: `Error sending push notification: ${error.message}` });
  }
};

const alertAllAdmin = async (req, res) => {
  const { message } = req.body;

  console.log("message: ", message);
  try {
    const querySnapshot = await db.collection("admin_push_token").get();
    const tokens = querySnapshot.docs.map((doc) => doc.data().token);

    const message = {
      notification: {
        title: "Alert!",
        body: message,
      },
      tokens,
    };

    admin
      .messaging()
      .sendEachForMulticast(message)
      .then((response) => {
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });

    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const alertAllPatrollers = async (req, res) => {
  const { reportType } = req.body;

  const message = {
    title: "Alert!",
    sound: "default",
    body: `New reported location - ${reportType}`,
    priority: "high",
  };

  try {
    const patrollersRef = db.collection("device_push_token");
    const querySnapshot = await patrollersRef.get();

    const tokens = querySnapshot.docs.map((doc) => doc.data().token);
    await pushNotification(tokens, message);

    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const notifyUsers = async (req, res) => {
  const { title } = req.body;

  const message = {
    title: "News",
    sound: "default",
    body: title,
    priority: "high",
  };

  try {
    const querySnapshot = await db.collection("user_push_token").get();
    const tokens = querySnapshot.docs.map((doc) => doc.data().token);
    await pushNotification(tokens, message);

    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  sendChatNotification,
  alertAllPatrollers,
  sendChatNotificationToAdmin,
  alertAllAdmin,
  notifyUsers,
};
