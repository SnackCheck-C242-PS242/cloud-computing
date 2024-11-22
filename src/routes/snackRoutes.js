const express = require("express");
const router = express.Router();
const addSnack = require("../handlers/snacks/addSnackHandler");
const getHistory = require("../handlers/snacks/getHistoryHandler");
const getSnackByName = require("../handlers/snacks/getSnackByNameHandler");
const updateSnack = require("../handlers/snacks/updateSnackHandler");
const authenticateToken = require("../../middleware/verifyToken");

router.post("/:username/predicts", authenticateToken, addSnack);
router.get("/:username/histories", authenticateToken, getHistory);
router.get(
  "/:username/histories/:snackName",
  authenticateToken,
  getSnackByName
);
router.put("/:username/histories/:snackName", authenticateToken, updateSnack);

module.exports = router;
