const db = require("../../config/firebase");

// Handler untuk mendapatkan data makanan berdasarkan nama snack
const getSnackByName = async (req, res) => {
  const { username, snackName } = req.params;

  const snackRef = db
    .collection("users")
    .doc(username)
    .collection("history")
    .doc(snackName);

  try {
    const snackDoc = await snackRef.get();

    if (!snackDoc.exists) {
      return res.status(404).json({
        status: "fail",
        message: `Snack dengan nama ${snackName} tidak ditemukan`,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data snack",
      snacks: {
        snackName: snackDoc.snackName,
        ...snackDoc.data(),
      },
    });
  } catch (err) {
    console.error("Error getting snack:", err);
    res.status(500).json({
      status: "fail",
      message: "Gagal mengambil data snack",
    });
  }
};

module.exports = getSnackByName;
