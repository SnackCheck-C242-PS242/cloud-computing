const jwt = require("jsonwebtoken");
const db = require("../src/config/firebase");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized",
    });
  }

  // Periksa apakah token ada di blacklist
  const blacklistRef = db.collection("tokenBlacklist").doc(token);
  const blacklistDoc = await blacklistRef.get();
  if (blacklistDoc.exists) {
    return res.status(403).json({
      status: "fail",
      message: "Forbidden",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: "fail",
        message: "Forbidden",
      });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
