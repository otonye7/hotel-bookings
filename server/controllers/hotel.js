const Hotel = require('../models/hotels');
const fs = require("fs");

const create = async (req, res) => {
    try {
        let fields = req.fields;
        let files = req.files;
        let hotel = new Hotel(fields)
        hotel.postedBy = req.auth._id
        if(files.image){
            hotel.image.data = fs.readFileSync(files.image.path);
            hotel.image.contentType = files.image.type;
        }
        hotel.save((err, result) => {
            if(err){
                console.log(err);
                res.status(400).send("Error saving")
            }
            return res.json(result)
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            err: err.message
        })
    }
}

const hotels = async (req, res) => {
    let all = await Hotel.find({})
    .limit(24)
    .select("-image.data")
    .populate("postedBy", "_id name")
    .exec()
    return res.json(all)
}

const image = async (req, res) => {
    let hotel = await Hotel.findById(req.params.hotelId).exec();
    if(hotel && hotel.image && hotel.image.data !== null){
        res.set(`Content-Type`, hotel.image.contentType);
        return res.send(hotel.image.data)
    }
}

const sellerHotels = async (req, res) => {
    let all = await Hotel.find({ postedBy: req.auth._id }).select("-image.data")
    .populate("postedBy", "_id name").exec();
    res.send(all)
}

module.exports = {
    create,
    hotels,
    image,
    sellerHotels
}