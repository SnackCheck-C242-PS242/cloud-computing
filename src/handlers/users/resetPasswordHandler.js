const db = require("../../config/firebase");
const bcrypt = require("bcrypt");
const { resetPasswordSchema } = require("./schema");

const resetPassword = async (req, res) => {
  const { email, resetCode, newPassword } = req.body;

  // Validasi input menggunakan Joi
  const { error } = resetPasswordSchema.validate({
    email,
    resetCode,
    newPassword,
  });
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  const resetRef = db.collection("passwordResets").doc(email);
  const resetDoc = await resetRef.get();

  if (!resetDoc.exists || resetDoc.data().resetCode !== resetCode) {
    return res.status(400).json({
      status: "fail",
      message: "Kode reset tidak valid",
    });
  }

  const userRef = db.collection("users").where("email", "==", email);
  const snapshot = await userRef.get();

  if (snapshot.empty) {
    return res.status(404).json({
      status: "fail",
      message: "User tidak ditemukan",
    });
  }

  const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  const userDoc = snapshot.docs[0];
  await userDoc.ref.update({
    password: hashedPassword,
  });

  // Hapus kode reset setelah digunakan
  await resetRef.delete();

  return res.status(200).json({
    status: "success",
    message: "Password berhasil direset",
  });
};

module.exports = resetPassword;
