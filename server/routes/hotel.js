const express = require("express");
const formidable = require("express-formidable");
const { requireSignin } = require("../middlewares/index");

const router = express.Router();

const { create, hotels, image, sellerHotels } = require("../controllers/hotel.js");

router.post("/create-hotel", requireSignin, formidable(), create);
router.get("/hotels", hotels);
router.get("/hotel/image/:hotelId", image);
router.get("/seller-hotels", requireSignin, sellerHotels)

module.exports = router