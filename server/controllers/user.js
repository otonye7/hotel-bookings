const User = require('../models/user');
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const { email, name, password, confirmPassword } = req.body;
    if(!email){
        res.status(400).send("Email is required");
        return;
    }
    if(!name){
        res.status(400).send("name is required");
        return;
    }
    if(!password){
        res.status(400).send("Password is required");
        return;
    }
    if(!confirmPassword){
        res.status(400).send("Please confirm your password");
        return;
    }
    if(password !== confirmPassword){
        res.send("Password must match");
        return;
    }
    const user = await User.findOne({ email }).exec();
    if(user){
        res.status(400).send("User already exist");
        return;
    }

    const newUser = new User({
        name,
        email,
        password,
        confirmPassword
    })
    try {
        await newUser.save();
        return res.json({
            ok: true
        })
    } catch (err) {
        console.log(err);
        res.status(400).send("Cant create user")
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if(!email){
        res.status(400).send("Email is required");
        return;
    }
    if(!password){
        res.status(400).send("Password is required");
        return
    }
   try {
    let user = await User.findOne({ email }).exec();
    if(!user){
        res.status(400).send("User does not exist")
    }
    user.comparePassword(password, (err, match) => {
        if(!match || err){
            res.status(400).send("Password does not match");
            return;
        }
        let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });
        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updateAt: user.updatedAt,
                stripe_account_id: user.stripe_account_id,
                stripe_seller: user.stripe_seller,
                stripeSession: user.stripeSession,
            }
        })
    })

   } catch (err) {
    console.log(err)
    return res.status(400).send("Login Failed")
   }
}

module.exports = {
    register,
    login
}