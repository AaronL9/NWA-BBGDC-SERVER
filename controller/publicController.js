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

module.exports = { getSingleNews };
