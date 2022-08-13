const express = require("express");
const formidable = require("express-formidable");
const { requireSignin } = require("../middlewares/index");

const router = express.Router();

const { create, hotels, image } = require("../controllers/hotel.js");

router.post("/create-hotel", requireSignin, formidable(), create);
router.get("/hotels", hotels);
router.get("/hotel/image/:hotelId", image)

module.exports = router