const jwt = require("jsonwebtoken");
const db = require("../config/firebase");

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

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({
        status: "fail",
        message: "Forbidden",
      });
    }

    // Ambil informasi tambahan dari database
    try {
      const userRef = db.collection("users").doc(user.username);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({
          status: "fail",
          message: "User not found",
        });
      }

      const userData = userDoc.data();
      req.user = {
        ...user,
        isVerified: userData.isVerified,
        fullName: userData.fullName,
        // Jangan tambahkan password ke req.user untuk alasan keamanan
      };

      console.log(req.user); // Log informasi user
      next(); // Lanjutkan ke middleware atau route handler berikutnya
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  });
};

module.exports = authenticateToken;
