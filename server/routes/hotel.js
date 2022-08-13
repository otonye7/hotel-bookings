const express = require("express");
const formidable = require("express-formidable");
const { requireSignin } = require("../middlewares/index");

const router = express.Router();

const { create, hotels } = require("../controllers/hotel.js");

router.post("/create-hotel", requireSignin, formidable(), create);
router.get("/hotels", hotels);

module.exports = router