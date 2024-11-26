const db = require("../../config/firebase");

const editFullName = async (req, res) => {
  try {
    const username = req.user.username; // Ambil username dari token JWT
    const { fullName } = req.body; // Ambil full name dari body request

    if (!fullName) {
      return res.status(400).json({
        status: "fail",
        message: "Full name is required",
      });
    }

    // Perbarui full name di database
    await db.collection("users").doc(username).set(
      {
        fullName: fullName,
      },
      { merge: true }
    );

    res.status(200).json({
      status: "success",
      message: "Full name updated successfully",
      fullName: fullName,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

module.exports = editFullName;
