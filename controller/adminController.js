const { v4: uuidv4 } = require("uuid");
const { admin } = require("../firebase/adminSdk");
const bcrypt = require("bcrypt");

const db = admin.firestore();
const uid = "sZn6iAa3IcNBhtgpofR2ykA1yRo2";
const customClaims = { admin: true };

const setAdmin = () => {
  admin
    .auth()
    .setCustomUserClaims(uid, customClaims)
    .then(() => {
      console.log("done");
    })
    .catch((error) => {
      console.log("error");
    });
};

const addPatroller = async (req, res) => {
  const userData = req.body;
  const uid = uuidv4();
  userData.uid = uid;

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

    const docRef = db.collection("patrollers");
    await docRef.add(userData);

    res.status(200).send({ message: "Added Successfully" });
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

module.exports = { setAdmin, addPatroller };
