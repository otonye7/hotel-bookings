const User = require("../models/user");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const queryString = require("query-string");

const createConnectAccount = async (req, res) => {
    const user = await User.findById(req.auth._id).exec();
    if(!user.stripe_account_id){
        const account = await stripe.accounts.create({
            type: 'express'
        });
        user.stripe_account_id = account.id
        user.save()
    }
    let accountLink = await stripe.accountLinks.create({
        account: user.stripe_account_id,
        refresh_url: process.env.STRIPE_REDIRECT_URL,
        return_url: process.env.STRIPE_REDIRECT_URL,
        type: "account_onboarding"
    });
    accountLink = Object.assign(accountLink, {
        "stripe_user[email]": user.email || undefined
    })
    res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`)
}

const getAccountStatus = async (req, res) => {
    const user = await User.findById(req.auth._id).exec();
    const account = await stripe.accounts.retrieve(user.stripe_account_id);
    const updatedUser = await User.findByIdAndUpdate(user._id, {
        stripe_seller: account
    }, {new: true}).select("-password").exec();
    res.json(updatedUser)
}

module.exports = {
   createConnectAccount,
   getAccountStatus
}