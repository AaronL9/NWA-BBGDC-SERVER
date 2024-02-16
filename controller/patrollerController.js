const { admin } = require("../firebase/adminSdk");
const bcrypt = require("bcrypt");

const db = admin.firestore();
const auth = admin.auth();

const patrollerLogin = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const username = await db
      .collection("patrollers")
      .where("username", "==", identifier)
      .get();
    const phoneNumber = await db
      .collection("patrollers")
      .where("phoneNo", "==", identifier)
      .get();

    const querySnapshot = !username.empty
      ? username
      : !phoneNumber.empty
      ? phoneNumber
      : null;

    if (!querySnapshot) {
      throw Error("Invalid credentials");
    }

    const patroller = querySnapshot.docs[0].data();

    const match = await bcrypt.compare(password, patroller.password);
    if (!match) {
      throw Error("Incorrect password");
    }

    const token = await auth.createCustomToken(patroller.uid, {
      patroller: true,
    });
    delete patroller.password;

    res.status(200).send({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const authorizePatroller = async (req, res) => {
  const uid = req.uid;

  try {
    const querySnapshot = await db
      .collection("patrollers")
      .where("uid", "==", uid)
      .get();

    const data = querySnapshot.docs[0].data();
    delete data.password;
    delete data.uid;

    res.status(200).send(data);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { patrollerLogin, authorizePatroller };
