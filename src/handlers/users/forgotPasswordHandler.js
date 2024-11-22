require("dotenv").config();
const db = require("../../config/firebase");
const { forgotPasswordSchema } = require("./schema");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Konfigurasi nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Validasi input menggunakan Joi
  const { error } = forgotPasswordSchema.validate({ email });
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  const userRef = db.collection("users").where("email", "==", email);
  const snapshot = await userRef.get();

  if (snapshot.empty) {
    return res.status(404).json({
      status: "fail",
      message: "Email belum terdaftar",
    });
  }

  const resetCode = crypto.randomBytes(3).toString("hex").toUpperCase();
  const resetRef = db.collection("passwordResets").doc(email);

  await resetRef.set({
    email,
    resetCode,
    createdAt: new Date(),
  });

  const mailOptions = {
    from: {
      name: "snackCheck",
      address: process.env.EMAIL,
    },
    to: email,
    subject: "Password Reset Code",
    text: `Kode reset password untuk akun anda adalah: ${resetCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({
        status: "error",
        message: "Gagal mengirim email",
        error: error.message, // Tambahkan pesan kesalahan untuk debugging
      });
    } else {
      return res.status(200).json({
        status: "success",
        message: "Kode reset password telah dikirim ke email",
      });
    }
  });
};

module.exports = forgotPassword;
