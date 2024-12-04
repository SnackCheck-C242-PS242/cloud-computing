const db = require("../../config/firebase");

const verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;

  // Cari kode verifikasi di koleksi emailVerifications
  const verificationRef = db
    .collection("emailVerifications")
    .where("email", "==", email)
    .where("verificationCode", "==", verificationCode);

  try {
    const snapshot = await verificationRef.get();
    if (snapshot.empty) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid verification code or user not found",
      });
    }

    const verificationDoc = snapshot.docs[0];
    const verificationData = verificationDoc.data();

    // Periksa apakah username sudah ada di koleksi users
    const userRef = db.collection("users").doc(verificationData.username);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      await verificationDoc.ref.delete();
      return res.status(409).json({
        status: "fail",
        message: "Username already in use",
      });
    }

    // Simpan user baru ke database
    await userRef.set({
      username: verificationData.username,
      fullName: verificationData.fullName,
      email: verificationData.email,
      password: verificationData.password,
      isVerified: true,
      createdAt: new Date().toISOString(),
    });

    // Hapus kode verifikasi setelah digunakan
    await verificationDoc.ref.delete();

    return res.status(200).json({
      status: "success",
      message: "Account successfully verified",
    });
  } catch (err) {
    console.error("Error verifying email:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = verifyEmail;
