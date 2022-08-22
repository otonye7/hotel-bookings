const express = require("express");
const formidable = require("express-formidable");
const { requireSignin, hotelOwner } = require("../middlewares/index");

const router = express.Router();

const { create, hotels, image, sellerHotels, remove, read, update, userHotelBookings } = require("../controllers/hotel.js");

router.post("/create-hotel", requireSignin, formidable(), create);
router.get("/hotels", hotels);
router.get("/hotel/image/:hotelId", image);
router.get("/seller-hotels", requireSignin, sellerHotels);
router.delete("/delete-hotel/:hotelId", requireSignin, hotelOwner, remove);
router.get("/hotel/:hotelId", read);
router.put("/update-hotel/:hotelId", requireSignin, hotelOwner, formidable(), update);
router.get("/user-hotel-bookings", requireSignin, userHotelBookings)

module.exports = router