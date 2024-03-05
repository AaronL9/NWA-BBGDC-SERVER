const { admin } = require("../firebase/adminSdk");

const getSingleNews = async (req, res) => {
  const { docId } = req.body;
  try {
    const snapshot = await admin
      .firestore()
      .collection("news")
      .doc(docId)
      .get();
    const newsData = snapshot.data();

    res.status(200).json(newsData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkPatrollerNumber = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const snapshot = await admin
      .firestore()
      .collection("patrollers")
      .where("phoneNumber", "==", phoneNumber)
      .select("phoneNumber")
      .get();

    const exist = !snapshot.empty;

    if (!exist) {
      throw new Error("Access Denied  ");
    }

    res.status(200).json({ exist: exist });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = { getSingleNews, checkPatrollerNumber };
