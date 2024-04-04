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

const getDirection = async (req, res) => {
  const { destination, origin } = req.body;

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?destination=${destination}&origin=${origin}&key=${process.env.GOOGLE_MAP_API_KEY}`
    );

    const data = await response.json();

    res.status(200).json({ polyline: data.routes[0].overview_polyline.points });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getSingleNews, checkPatrollerNumber, getDirection };
