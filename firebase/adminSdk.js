const admin = require("firebase-admin");
const path = require("path");
const serviceAccount = path.join(__dirname, "../credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = { admin };
