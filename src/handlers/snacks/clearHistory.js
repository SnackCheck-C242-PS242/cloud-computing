const db = require("../../config/firebase");

const clearHistory = async (req, res) => {
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
        message: "No snack history to clear",
      });
    }

    const batch = db.batch();
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    return res.status(200).json({
      status: "success",
      message: "Snack history cleared",
    });
  } catch (err) {
    console.error("Error clearing snack history:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = clearHistory;