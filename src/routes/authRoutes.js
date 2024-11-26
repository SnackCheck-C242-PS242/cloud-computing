const express = require("express");
const router = express.Router();
const registerUser = require("../handlers/users/registerHandler");
const loginUser = require("../handlers/users/loginHandler");
const refreshToken = require("../handlers/users/refreshTokenHandler");
const logoutUser = require("../handlers/users/logoutHandler");
const forgotPassword = require("../handlers/users/forgotPasswordHandler");
const resetPassword = require("../handlers/users/resetPasswordHandler");
const verifyEmail = require("../handlers/users/verifyEmailHandler");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refreshToken", refreshToken);
router.post("/logout", logoutUser);
router.post("/password", forgotPassword);
router.put("/password", resetPassword);
router.post("/verifyEmail", verifyEmail);

module.exports = router;
