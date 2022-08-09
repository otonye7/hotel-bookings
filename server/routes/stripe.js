const express = require("express");

const router = express.Router();

const { requireSignin } = require("../middlewares/index");

const { createConnectAccount, getAccountStatus } = require("../controllers/stripe");

router.post("/create-connect-account", requireSignin, createConnectAccount);
router.post("/get-account-status", requireSignin, getAccountStatus)

module.exports = router