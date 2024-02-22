const { admin } = require("../firebase/adminSdk");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Missing token" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
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

const checkUserRole = (requiredRole) => {
  return async (req, res, next) => {
    const { uid } = req; // Use UID attached from verifyToken middleware

    try {
      const user = await admin.auth().getUser(uid);
      const { customClaims } = user;

      if (customClaims && customClaims.role === requiredRole) {
        next();
      } else {
        res.status(403).json({ error: "Unauthorized" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

module.exports = { verifyToken, checkUserRole, verifyAdminToken };
