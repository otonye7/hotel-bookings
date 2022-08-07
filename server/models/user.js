const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    email: {
        type: String,
        trim: true,
        required: "Email is required",
        unique: true
    },
    name: {
        type: String,
        trim: true,
        required: "name is required"
    },
    password: {
        type: String,
        trim: true,
        required: "Password is required"
    },
    confirmPassword: {
        type: String,
        trim: true,
        required: true
    },
    stripe_account_id:"",
    stripe_seller: {},
    stripeSession: {},
}, {  timestamps: true })
//when to hash
//you want to hash when a user just created his password
//when a user just updated his existing password
userSchema.pre('save', function (next) {
    //the above code means anytime we use User.save() we want to execute the
    //callback function
    let user = this;
    //this refers to the user schema above
    if (user.isModified('password')) {
        //if user has modified the password
        return bcrypt.hash(user.password, 12, function (err, hash) {
            if (err) {
                console.log('Bcrypt has error', err);
                return next(err)
            }
            user.password = hash;
            return next();
        })
    } else {
        return next();
    }
})

userSchema.methods.comparePassword = function (password, next) {
    bcrypt.compare(password, this.password, function (err, match) {
        if (err) {
            console.log(err);
            return next(err, false)
        }
        console.log(match)
        return next(null, match)
    })
}


module.exports = User = mongoose.model("User", userSchema)