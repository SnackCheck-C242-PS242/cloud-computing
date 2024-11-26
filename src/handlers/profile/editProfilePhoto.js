const { Storage } = require("@google-cloud/storage");
const path = require("path");
const db = require("../../config/firebase");

const serviceAccountKeyPath = path.join(
  __dirname,
  "../../config/serviceAccountKey.json"
);
const storage = new Storage({ keyFilename: serviceAccountKeyPath });
const bucketName = "capstone-snackcheck.firebasestorage.app"; // replace with your bucket name

const editProfilePhoto = async (req, res) => {
  try {
    const username = req.user.username; // Ambil username dari token JWT
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(`${username}/${req.file.originalname}`);
    const blobStream = blob.createWriteStream();

    blobStream.on("error", (err) => {
      res.status(500).json({ status: "error", message: err.message });
    });

    blobStream.on("finish", async () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;

      // Perbarui metadata foto di database
      await db.collection("users").doc(username).set(
        {
          profilePhotoUrl: publicUrl,
          profilePhotoName: req.file.originalname,
        },
        { merge: true }
      );

      res.status(200).json({
        status: "success",
        message: "Profile photo updated successfully",
        url: publicUrl,
      });
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

module.exports = editProfilePhoto;
