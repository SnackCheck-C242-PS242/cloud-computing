const db = require("../../config/firebase");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Ambil user berdasarkan email
    const userSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (userSnapshot.empty) {
      return res.status(404).json({
        status: "fail",
        message: "Email not found",
      });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    const fullName = userData.fullName; // Ambil fullName dari data user

    // Generate reset code
    const resetCode = crypto.randomInt(10000, 100000).toString();

    // Simpan reset code di database
    await db.collection("passwordResets").doc(email).set({
      resetCode,
      createdAt: new Date(),
    });

    // Konfigurasi email
    const mailOptions = {
      from: {
        name: "snackCheck",
        address: process.env.EMAIL,
      },
      to: email,
      subject: "Password Reset Code",
      text: `Hello ${fullName}, \n\nThe verification code to reset your password is: ${resetCode}`,
    };

    // Kirim email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
          status: "error",
          message: "Error sending email",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Password reset code sent successfully",
      });
    });
  } catch (error) {
    console.error("Error processing forgot password request:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = forgotPassword;
