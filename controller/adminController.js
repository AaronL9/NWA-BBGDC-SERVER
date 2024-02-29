const { admin } = require("../firebase/adminSdk");

const db = admin.firestore();
const auth = admin.auth();

const setAdmin = (req, res) => {
  const { uid, key } = req.body;

  if (process.env.DEVELOPER_KEY !== key) {
    res.status(409).json({ error: "not allowed" });
    return;
  }

  auth
    .setCustomUserClaims(uid, { admin: true })
    .then(() => {
      res.status(200).send({ message: "SET ADMIN SUCCESSFULLY" });
    })
    .catch((error) => {
      res.status(409).json({ error: error.message });
    });
};

const addPatrollerByPhoneNumber = async (req, res) => {
  const patrollerInfo = req.body;

  try {
    const { uid } = await auth.createUser({
      phoneNumber: patrollerInfo.phoneNumber,
    });
    await auth.setCustomUserClaims(uid, {
      patroller: true,
    });
    patrollerInfo.uid = uid;

    const docRef = db.collection("patrollers").doc(uid);
    await docRef.set(patrollerInfo);

    const displayName = `${patrollerInfo.firstName} ${patrollerInfo.lastName}`;
    const id = uid;
    await createConversation({ id, displayName });

    res.status(200).json({ message: "Added Successfully" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const createConversation = async (patroller) => {
  try {
    const querySnapshot = await db.collection("admins").get();

    querySnapshot.forEach((doc) => {
      const { displayName } = doc.data();
      const id = doc.id;
      const admin = { id, displayName };
      db.collection("rooms").add({ patroller, admin, updatedAt: new Date() });
    });
  } catch (error) {
    console.error("Error creating convo: ", error);
  }
};

module.exports = { setAdmin, addPatrollerByPhoneNumber };
