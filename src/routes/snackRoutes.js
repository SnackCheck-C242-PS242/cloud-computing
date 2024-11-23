const express = require("express");
const router = express.Router();
const predictSnack = require("../handlers/snacks/predictSnack");
const getHistory = require("../handlers/snacks/getHistoryHandler");
const getSnackByName = require("../handlers/snacks/getSnackByNameHandler");
const updateSnack = require("../handlers/snacks/updateSnackHandler");
const authenticateToken = require("../../middleware/verifyToken");

router.post("/predicts", authenticateToken, predictSnack);
router.get("/histories", authenticateToken, getHistory);
router.get("/histories/:snackName", authenticateToken, getSnackByName);
router.put("/histories/:snackName", authenticateToken, updateSnack);

module.exports = router;
