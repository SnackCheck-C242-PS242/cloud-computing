const db = require("../../config/firebase");
const axios = require("axios");
const crypto = require("crypto");



const predictSnack = async (req, res) => {
  const { snackName, nutritions } = req.body;
  const username = req.user.username; // Ambil username dari token JWT
  
  const generateId = (length = 16) => {
    return crypto.randomBytes(length).toString("hex").slice(0, length);
  };

  const snackId = generateId()

  try {
    // Panggil API machine learning untuk mendapatkan kategori dan rekomendasi
    const response = await axios.post(
      "https://ml-api-711542614177.asia-southeast2.run.app/predict",
      {
        snackName,
        nutritions,
      }
    );
    console.log("Response from ML API:", response.data);

    const { health_status, recommendation } = response.data;
    const snackRef = db
      .collection("users")
      .doc(username)
      .collection("history")
      .doc(snackId);
    await snackRef.set({
      snackId,
      snackName,
      nutritions,
      health_status,
      recommendation,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({
      status: "success",
      message: "Snack successfully predicted",
      result: {
        snackId,
        snackName,
        nutritions,
        health_status,
        recommendation,
      },
    });
  } catch (err) {
    console.error("Error adding snack:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = predictSnack;
