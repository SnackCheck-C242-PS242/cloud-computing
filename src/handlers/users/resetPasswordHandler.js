const db = require("../../config/firebase");
const bcrypt = require("bcrypt");
const { resetPasswordSchema } = require("./schema");

const resetPassword = async (req, res) => {
  const { email, resetCode, newPassword, confirmPassword } = req.body;

  // Validasi input menggunakan Joi
  const { error } = resetPasswordSchema.validate({
    email,
    resetCode,
    newPassword,
    confirmPassword,
  });
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  try {
    const resetRef = db.collection("passwordResets").doc(email);
    const resetDoc = await resetRef.get();

    if (!resetDoc.exists || resetDoc.data().resetCode !== resetCode) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid reset code",
      });
    }

    const userRef = db.collection("users").where("email", "==", email);
    const snapshot = await userRef.get();

    if (snapshot.empty) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const userDoc = snapshot.docs[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userDoc.ref.update({
      password: hashedPassword,
    });

    // Hapus reset code setelah digunakan
    await resetRef.delete();

    return res.status(200).json({
      status: "success",
      message: "Password successfully reset",
    });
  } catch (err) {
    console.error("Error resetting password:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = resetPassword;
