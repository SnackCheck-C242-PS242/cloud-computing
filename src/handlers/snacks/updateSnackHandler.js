const db = require("../../config/firebase");

// Handler untuk memperbarui data makanan di history user
const updateSnack = async (req, res) => {
  const { username } = req.params;
  const {
    snackName,
    nutrition,
  } = req.body;

  const snack = {
    snackName,
    nutrition,
  };

  const docRef = db
    .collection("users")
    .doc(username)
    .collection("history")
    .doc(snackId);

  try {
    await docRef.update(snack);
    res.status(200).json({
      status: "success",
      message: "Berhasil memperbarui data",
      snacks: snack,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Gagal memperbarui data",
    });
  }
};

module.exports = updateSnack;
