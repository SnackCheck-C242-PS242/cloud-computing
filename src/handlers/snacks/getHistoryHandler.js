const db = require("../../config/firebase");

// Handler untuk mendapatkan data history makanan user
const getHistory = async (req, res) => {
  const { username } = req.params;

  try {
    const historyRef = db
      .collection("users")
      .doc(username)
      .collection("history");
    const snapshot = await historyRef.get();

    if (snapshot.empty) {
      return res.status(404).json({
        status: "fail",
        message: "History tidak ditemukan",
      });
    }

    const historyData = snapshot.docs.map((doc) => ({
      snackName: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data history",
      snacks: historyData,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Gagal mengambil data history",
    });
  }
};

module.exports = getHistory;
