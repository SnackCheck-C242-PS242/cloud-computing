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
    const snackDoc = await docRef.get();
    if (snackDoc.exists) {
      return res.status(409).json({
        status: "fail",
        message:
          "Snack sudah ada, apakah anda ingin mengganti informasinya dengan informasi yang baru?",
      });
    }

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

module.exports = addSnack;
