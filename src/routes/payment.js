const express = require("express");
require('dotenv').config();
const { jwtAuth } = require("../middleware/validateData");
const paymentRouter = express.Router();
const Payment = require("../models/payment");
const razorpayInstance = require('../utils/razorpay');
const { membershipAmount } = require("../utils/constants");
paymentRouter.post("/payment/create", jwtAuth, async(req, res) => {
try {
    const {membershipType} = req.body;
    const{firstName, lastName,emailId} = req.user;
   const order =  await razorpayInstance.orders.create({
        amount: membershipAmount[membershipType]*100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
       currency: "INR",
        receipt: "order_rcptid_11",
        notes:{
            firstName,
            lastName,
            emailId,
            membershipType,

        }
    })
    //console.log(order);
    const payment = new Payment({
        userId: req.user._id,
        orderId: order.id,
        status: order.status,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        notes: order.notes,
      });
  
      const savedPayment = await payment.save();
    res.json({...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID});
} catch (error) {
     res.json({error: error.message});
}
})







module.exports = paymentRouter;