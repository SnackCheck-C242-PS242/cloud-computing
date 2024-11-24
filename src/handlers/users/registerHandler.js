require("dotenv").config();
const db = require("../../config/firebase");
const { registerSchema } = require("./schema");
const bcrypt = require("bcrypt");
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

const registerUser = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Validasi input menggunakan Joi
  const { error } = registerSchema.validate({
    username,
    email,
    password,
    confirmPassword,
  });
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  const userRef = db.collection("users").doc(username);
  const emailRef = db.collection("users").where("email", "==", email);

  try {
    // Cek apakah username sudah terdaftar
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      return res.status(409).json({
        status: "fail",
        message: "Username sudah digunakan",
      });
    }

    // Cek apakah email sudah terdaftar
    const emailSnapshot = await emailRef.get();
    if (!emailSnapshot.empty) {
      return res.status(409).json({
        status: "fail",
        message: "Email already in use",
      });
    }

    // Hash password menggunakan bcrypt
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Buat kode verifikasi berupa angka (6 digit)
    const verificationCode = crypto.randomInt(10000, 100000).toString();

    // Simpan kode verifikasi ke koleksi terpisah
    const verificationRef = db.collection("emailVerifications").doc(email);
    await verificationRef.set({
      username,
      email,
      password: hashedPassword,
      verificationCode,
      createdAt: new Date(),
    });

    // Kirim email verifikasi
    const mailOptions = {
      from: {
        name: "snackCheck",
        address: process.env.EMAIL,
      },
      to: email,
      subject: "Email Verification Code",
      text: `The verification code for your account is: ${verificationCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
          status: "error",
          message: "Failed to send verification code",
        });
      } else {
        return res.status(201).json({
          status: "success",
          message: "Verification code has been sent to email",
        });
      }
    });
  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = registerUser;
