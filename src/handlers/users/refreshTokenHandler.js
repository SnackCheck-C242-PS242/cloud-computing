require("dotenv").config();
const db = require("../../config/firebase");
const jwt = require("jsonwebtoken");

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const docRef = db.collection("users").doc(decoded.username);
    const userDoc = await docRef.get();

    if (!userDoc.exists || userDoc.data().refreshToken !== refreshToken) {
      return res.status(403).json({
        status: "fail",
        message: "Forbidden",
      });
    }

    const accessToken = jwt.sign(
      { username: decoded.username, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return res.status(200).json({
      status: "success",
      accessToken,
    });
  } catch (err) {
    console.error("Error refreshing token:", err);
    return res.status(403).json({
      status: "fail",
      message: "Forbidden",
    });
  }
};

module.exports = refreshToken;
