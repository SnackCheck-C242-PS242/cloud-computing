require("dotenv").config();
const db = require("../../config/firebase");
const { loginSchema } = require("./schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Validasi input menggunakan Joi
  const { error } = loginSchema.validate({ username, password });
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  const docRef = db.collection("users").doc(username);

  try {
    // Cek apakah user ditemukan
    const userDoc = await docRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const userData = userDoc.data();

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "fail",
        message: "Wrong password",
      });
    }

    // Buat access token dan refresh token
    const accessToken = jwt.sign(
      { username: userData.username, email: userData.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Masa berlaku access token 15 menit
    );

    const refreshToken = jwt.sign(
      { username: userData.username, email: userData.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" } // Masa berlaku refresh token 7 hari
    );

    // Simpan refresh token di database
    await docRef.update({ refreshToken });

    return res.status(200).json({
      status: "success",
      message: "Login successsful",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Error logging in user:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = loginUser;
