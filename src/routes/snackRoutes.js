const express = require("express");
const router = express.Router();
const predictSnack = require("../handlers/snacks/predictSnack");
const getHistory = require("../handlers/snacks/getHistoryHandler");
const getSnackById = require("../handlers/snacks/getSnackByIdHandler");
const clearHistory = require("../handlers/snacks/clearHistory");

router.post("/predicts", predictSnack);
router.get("/histories", getHistory);
router.delete("/histories", clearHistory);
router.get("/histories/:snackId", getSnackById);

module.exports = router;
