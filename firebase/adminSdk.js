const admin = require("firebase-admin");
const path = require("path");
const serviceAccount = path.join(__dirname, "../credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});

module.exports = { admin };
