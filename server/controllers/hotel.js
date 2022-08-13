const Hotel = require('../models/hotels');
const fs = require("fs");

const create = async (req, res) => {
    try {
        let fields = req.fields;
        let files = req.files;
        let hotel = new Hotel(fields)
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

module.exports = {
    create,
    hotels
}