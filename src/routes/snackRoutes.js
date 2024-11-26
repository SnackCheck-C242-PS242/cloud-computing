const express = require("express");
const router = express.Router();
const predictSnack = require("../handlers/snacks/predictSnack");
const getHistory = require("../handlers/snacks/getHistoryHandler");
const getSnackByName = require("../handlers/snacks/getSnackByNameHandler");

router.post("/predicts", predictSnack);
router.get("/histories", getHistory);
router.get("/histories/:snackName", getSnackByName);

module.exports = router;
