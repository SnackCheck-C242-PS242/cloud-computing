const db = require("../../config/firebase");

const getUserProfileInfo = async (req, res) => {
  try {
    const username = req.user.username; // Ambil username dari token JWT
    const fullName = req.user.fullName;
    const email = req.user.email;

    const userDoc = await db.collection("users").doc(username).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const userData = userDoc.data();
    res.status(200).json({
      status: "success",
      data: { fullName, 
        username,
        email,
        profilePhotoUrl: userData.profilePhotoUrl }
});
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

module.exports = getUserProfileInfo;
