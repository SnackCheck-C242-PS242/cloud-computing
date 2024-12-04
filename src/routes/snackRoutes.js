const express = require("express");
const router = express.Router();
const predictSnack = require("../handlers/snacks/predictSnack");
const getHistory = require("../handlers/snacks/getHistoryHandler");
const getSnackById = require("../handlers/snacks/getSnackByIdHandler");

router.post("/predicts", predictSnack);
router.get("/histories", getHistory);
router.get("/histories/:snackId", getSnackById);

module.exports = router;
