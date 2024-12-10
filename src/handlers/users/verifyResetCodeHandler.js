const db = require("../../config/firebase");


const verifyResetCode = async (req, res) => {
  const { email, resetCode } = req.body;

  try {
    const resetRef = db.collection("passwordResets").doc(email);
    const resetDoc = await resetRef.get();

    if (!resetDoc.exists || resetDoc.data().resetCode !== resetCode) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid reset code",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Reset code verified",
    });
  } catch (err) {
    console.error("Error verifying reset code:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = verifyResetCode;
