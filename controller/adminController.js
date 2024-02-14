const { v4: uuidv4 } = require("uuid");
const { admin } = require("../firebase/adminSdk");
const bcrypt = require("bcrypt");

const db = admin.firestore();
const auth = admin.auth();
const uid = "5FA9kYaagseNlsgvvA63TCWO2qY2";
const customClaims = { admin: true };

const setAdmin = (req, res) => {
  auth
    .setCustomUserClaims(uid, customClaims)
    .then(() => {
      res.status(200).send({ message: "SET ADMIN SUCCESSFULLY" });
    })
    .catch((error) => {
      res.status(409).json({ error: error.message });
    });
};

const addPatroller = async (req, res) => {
  const userData = req.body;
  userData.uid = uuidv4();

  try {
    const username = await db
      .collection("patrollers")
      .where("username", "==", userData.username)
      .get();
    const phoneNumber = await db
      .collection("patrollers")
      .where("phoneNo", "==", userData.phoneNo)
      .get();

    if (!username.empty) {
      throw Error("Username is taken");
    }
    if (!phoneNumber.empty) {
      throw Error("Phone number is taken");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(userData.password, salt);
    userData.password = hash;

    const docRef = db.collection("patrollers").doc(userData.uid);
    await docRef.set(userData);

    res.status(200).send({ message: "Added Successfully" });
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

module.exports = { setAdmin, addPatroller };
