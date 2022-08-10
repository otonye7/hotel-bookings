const express = require("express");

const router = express.Router();

const { requireSignin } = require("../middlewares/index");

const { createConnectAccount, getAccountStatus, getAccountBalance, payoutSetting } = require("../controllers/stripe");

router.post("/create-connect-account", requireSignin, createConnectAccount);
router.post("/get-account-status", requireSignin, getAccountStatus);
router.post("/get-account-balance",  requireSignin, getAccountBalance);
router.post("/payout-setting", requireSignin, payoutSetting)

module.exports = router