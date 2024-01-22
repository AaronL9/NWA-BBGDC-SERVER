const { v4: uuidv4 } = require("uuid");
const admin = require("firebase-admin");
const bcrypt = require("bcrypt");
const serviceAccount = require("../key/credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});

const db = admin.firestore();
const auth = admin.auth();
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
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(userData.password, salt);
    userData.password = hash;

    const docRef = db.collection("patrollers");
    await docRef.add(userData);

    res.status(200).send({ message: "Added Successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { setAdmin, addPatroller };
