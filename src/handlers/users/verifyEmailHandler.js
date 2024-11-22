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
        message: "Kode verifikasi tidak valid atau user tidak ditemukan",
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
        message: "Username telah digunakan",
      });
    }

    // Simpan user baru ke database
    await userRef.set({
      username: verificationData.username,
      email: verificationData.email,
      password: verificationData.password,
      isVerified: true,
    });

    // Hapus kode verifikasi setelah digunakan
    await verificationDoc.ref.delete();

    return res.status(200).json({
      status: "success",
      message: "Email berhasil diverifikasi",
    });
  } catch (err) {
    console.error("Error verifying email:", err);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
};

module.exports = verifyEmail;
