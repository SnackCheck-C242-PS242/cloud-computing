const db = require("../../config/firebase");

// Handler untuk menambahkan data makanan ke history user
const addSnack = async (req, res) => {
  const { username } = req.params;
  const {
    snackName,
    nutrition: { sugar, fat, salt },
  } = req.body;

  const snack = {
    snackName,
    nutrition: { sugar, fat, salt },
  };

  const docRef = db
    .collection("users")
    .doc(username)
    .collection("history")
    .doc(snackName);

  try {
    await docRef.set(snack);
    res.status(200).json({
      status: "success",
      message: "Berhasil menambahkan data",
      snacks: snack,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Gagal menambahkan data",
    });
  }
};

// Handler untuk mendapatkan data history makanan user
const getHistory = async (req, res) => {
  const { username } = req.params;
  const historyRef = db.collection("users").doc(username).collection("history");

  try {
    const snapshot = await historyRef.get();

    if (snapshot.empty) {
      return res.status(404).json({
        status: "fail",
        message: "History tidak ditemukan untuk pengguna ini",
      });
    }

    const historyData = snapshot.docs.map((doc) => ({
      id: doc.id,
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

module.exports = { addSnack, getHistory, getSnackByName };
