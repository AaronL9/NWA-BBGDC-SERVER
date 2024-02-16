const admin = require("firebase-admin");
const path = require("path");
const serviceAccount = path.join(
  __dirname,
  "../nwa-bbgdc-firebase-adminsdk-pnq5d-b6d4b97e1a.json"
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = { admin };
