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

const changeUserStatus = async (req, res) => {
  const { uid, disabled } = req.body;

  try {
    await auth.updateUser(uid, { disabled });
    await db.collection("users").doc(uid).update({ disabled });

    res.status(200).json({ message: "User status successfully changed" });
  } catch (error) {
    res.status(200).json({
      error: error.message,
    });
  }
};

const deletePatroller = async (req, res) => {
  const { uid } = req.body;
  try {
    await auth.deleteUser(uid);
    await db.doc(`patrollers/${uid}`).delete();

    await deleteConversation(uid);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteConversation = async (patrollerId) => {
  try {
    const querySnapshot = await db
      .collection("rooms")
      .where("patroller.id", "==", patrollerId)
      .get();

    const batch = db.batch();

    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  } catch (error) {
    console.error("Error deleting convo: ", error);
  }
};

module.exports = {
  setAdmin,
  addPatrollerByPhoneNumber,
  changeUserStatus,
  deletePatroller,
};
