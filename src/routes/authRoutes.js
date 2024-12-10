const express = require("express");
const router = express.Router();
const registerUser = require("../handlers/users/registerHandler");
const loginUser = require("../handlers/users/loginHandler");
const refreshToken = require("../handlers/users/refreshTokenHandler");
const logoutUser = require("../handlers/users/logoutHandler");
const forgotPassword = require("../handlers/users/forgotPasswordHandler");
const verifyResetCode = require("../handlers/users/verifyResetCodeHandler");
const setNewPassword = require("../handlers/users/setNewPasswordHandler");
const verifyEmail = require("../handlers/users/verifyEmailHandler");
const authenticateToken = require("../middleware/verifyToken");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/token", refreshToken);
router.post("/logout", authenticateToken, logoutUser);
router.post("/password", forgotPassword);
router.post("/accounts", verifyEmail);
router.post("/password/verify", verifyResetCode);
router.put("/password", setNewPassword);

module.exports = router;
