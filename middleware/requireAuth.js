const { admin } = require("../firebase/adminSdk");

const authorization = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Missing token" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.uid = decodedToken.uid;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);

    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({ error: "Unauthorized - Token expired" });
    }

    return res.status(403).json({ error: "Unauthorized - Invalid token" });
  }
};

const verifyAdminToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Missing token" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    if (decodedToken.admin !== true) {
      return res
        .status(403)
        .json({ error: "Unauthorized - User is not an admin" });
    }

    req.uid = decodedToken.uid; // Attach UID to request for later use
    next();
  } catch (error) {
    console.error("Error verifying token:", error);

    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({ error: "Unauthorized - Token expired" });
    }

    return res.status(403).json({ error: "Unauthorized - Invalid token" });
  }
};

module.exports = { authorization, verifyAdminToken };
