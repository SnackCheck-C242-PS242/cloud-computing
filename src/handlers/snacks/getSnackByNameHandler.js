const db = require("../../config/firebase");

// Handler untuk mendapatkan data makanan berdasarkan nama snack
const getSnackByName = async (req, res) => {
  const { snackName } = req.params;
  const username = req.user.username; // Ambil username dari token JWT

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
        message: `Snack with name ${snackName} was not found`,
      });
    }

    res.status(200).json({
      status: "success",
      data: snackDoc.data(),
    });
  } catch (err) {
    console.error("Error getting snack by name:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = getSnackByName;
