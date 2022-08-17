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

const updateDelayDays = async (accountId) => {
    const account = await stripe.accounts.update(accountId, {
        settings: {
            payouts: {
                schedule: {
                    delay_days: 7
                }
            }
        }
    })
    return account
}

const getAccountStatus = async (req, res) => {
    const user = await User.findById(req.auth._id).exec();
    const account = await stripe.accounts.retrieve(user.stripe_account_id);
    const updatedAccount = await updateDelayDays(account.id)
    const updatedUser = await User.findByIdAndUpdate(user._id, {
        stripe_seller: updatedAccount
    }, {new: true}).select("-password").exec();
    res.json(updatedUser)
}

const getAccountBalance = async (req, res) => {
    const user = await User.findById(req.auth._id).exec();
    try {
        const balance = await stripe.balance.retrieve({
            stripeAccount: user.stripe_account_id
        });
        res.json(balance)
    } catch (err) {
        console.log(err)
    }
}

const payoutSetting = async (req, res) => {
    try {
        const user = await User.findById(req.auth._id).exec();
        const loginLink = await stripe.accounts.createLoginLink(user.stripe_seller.id, {
            redirect_url: process.env.STRIPE_SETTING_REDIRECT_URL
        })
        res.json(loginLink)
    } catch (err) {
        console.log(err)
    }
}

const stripeSessionId = async (req, res) => {
    const { hotelId } = req.body;
    const item = await Hotel.findById(hotelId).populate("postedBy").exec();
    const fee = (item.price * 20) / 100;
 
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        // 5 purchasing item details, it will be shown to user on checkout
        line_items: [
          {
            name: item.title,
            amount: item.price * 100, // in cents
            currency: "usd",
            quantity: 1,
          },
        ],
        // 6 create payment intent with application fee and destination charge 80%
        payment_intent_data: {
          application_fee_amount: fee * 100,
          // this seller can see his balance in our frontend dashboard
          transfer_data: {
            destination: item.postedBy.stripe_account_id,
          },
        },
        // success and calcel urls
        success_url: `${process.env.STRIPE_SUCCESS_URL}/${item._id}`,
        cancel_url: process.env.STRIPE_CANCEL_URL,
      });
     
      // 7 add this session object to user in the db
      await User.findByIdAndUpdate(req.auth._id, { stripeSession: session }).exec();
      // 8 send session id as resposne to frontend
      res.send({
        sessionId: session.id,
      });

}

module.exports = {
   createConnectAccount,
   getAccountStatus,
   getAccountBalance,
   payoutSetting,
   stripeSessionId
}