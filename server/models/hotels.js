const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const hotelSchema = new Schema({
    title: {
        type: String,
        required: "Title is Required"
    },
    content: {
        type: String,
        required: "Content is Required",
        maxlength: 10000
    },
    location: {
        type: String
    },
    price: {
        type: Number,
        required: "Price is Required",
        trim: true
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    image: {
        data: Buffer,
        contentType: String
    },
    from: {
        type: Date
    },
    to: {
        type: Date
    },
    bed: {
        type: Number
    }
}, {timestamps: true})

module.exports = Hotel = mongoose.model("Hotel", hotelSchema)