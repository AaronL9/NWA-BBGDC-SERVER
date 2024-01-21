require("dotenv").config();
const admin = require("firebase-admin");
const express = require("express");

const app = express();
const serviceAccount = require("./key/credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});

const uid = "sZn6iAa3IcNBhtgpofR2ykA1yRo2";
const customClaims = { admin: true };

admin
  .auth()
  .setCustomUserClaims(uid, customClaims)
  .then(() => {
    console.log('done')
  })
  .catch((error) => {
    console.log('error')
  });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});