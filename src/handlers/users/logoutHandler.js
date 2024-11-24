require("dotenv").config();
const db = require("../../config/firebase");
const jwt = require("jsonwebtoken");

const logoutUser = async (req, res) => {
  const { username } = req.body;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!username || !token) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid username or token",
    });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.username !== username) {
      return res.status(403).json({
        status: "fail",
        message: "Forbidden",
      });
    }

    const docRef = db.collection("users").doc(username);
    const blacklistRef = db.collection("tokenBlacklist").doc(token);

    // Tambahkan token ke blacklist
    await blacklistRef.set({ token });

    // Hapus refresh token dari database
    await docRef.update({ refreshToken: null });

    return res.status(200).json({
      status: "success",
      message: "Logout successful",
    });
  } catch (err) {
    console.error("Error logging out user:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = logoutUser;
