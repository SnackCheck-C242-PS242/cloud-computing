const db = require("../../config/firebase");

const getHistory = async (req, res) => {
  const username = req.user.username; // Ambil username dari token JWT

  try {
    const snacksRef = db
      .collection("users")
      .doc(username)
      .collection("history");
    const snapshot = await snacksRef.get();

    if (snapshot.empty) {
      return res.status(404).json({
        status: "fail",
        message: "Tidak ada riwayat snack",
      });
    }

    const snacks = [];
    snapshot.forEach((doc) => {
      snacks.push(doc.data());
    });

    return res.status(200).json({
      status: "success",
      data: snacks,
    });
  } catch (err) {
    console.error("Error getting snack history:", err);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
};

module.exports = getHistory;
