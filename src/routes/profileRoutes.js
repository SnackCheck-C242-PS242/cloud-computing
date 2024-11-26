const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadHandler"); // Path ke file konfigurasi multer
const uploadProfilePhoto = require("../handlers/profile/uploadProfilePhoto");
const editProfilePhoto = require("../handlers/profile/editProfilePhoto");
const editFullName = require("../handlers/profile/editFullName");
const getUserProfilePhoto = require("../handlers/profile/getUserProfilePhoto");

module.exports = (upload) => {
  // Route to upload profile photo
  router.post("/photo", upload.single("profilePhoto"), uploadProfilePhoto);

  // Route to edit profile photo
  router.put("/photo", upload.single("profilePhoto"), editProfilePhoto);

  // Route to edit full name
  router.put("/fullname", editFullName);

  // Route to get profile photo URL
  router.get("/", getUserProfilePhoto);

  return router;
};
