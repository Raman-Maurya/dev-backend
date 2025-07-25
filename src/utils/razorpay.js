// require('dotenv').config();
require('dotenv').config({ path: '../.env' });
const Razorpay = require('razorpay');

var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,    
  });

  module.exports = instance;  