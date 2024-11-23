const db = require("../../config/firebase");

const addSnack = async (req, res) => {
  const { snackName, nutrition } = req.body;
  const username = req.user.username; // Ambil username dari token JWT

  try {
    const snackRef = db
      .collection("users")
      .doc(username)
      .collection("history")
      .doc(snackName);
    await snackRef.set({
      snackName,
      nutrition,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({
      status: "success",
      message: "Snack berhasil ditambahkan",
    });
  } catch (err) {
    console.error("Error adding snack:", err);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
};

module.exports = addSnack;
