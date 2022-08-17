const { expressjwt: expressJwt } = require('express-jwt');
const Hotel = require("../models/hotels");

const requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
})

const hotelOwner = async (req, res, next) => {
    let hotel = await Hotel.findById(req.params.hotelId).exec();
    let owner = hotel.postedBy._id == req.auth._id;
    if(!owner){
        res.status(403).send("You are not the owner of this post")
    }
    next();
}

module.exports = {
    requireSignin,
    hotelOwner
}