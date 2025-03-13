const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
   
    userId: {
       type:  mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    },
    paymentId: {
        type: String,
    },
    orderId: {
        type: String,
        required:true,
        
    },
    status: {
        type: String,
        
      },
      amount: {
        type: Number,
        
      },
      currency: {
        type: String,
       
      },
      receipt: {
        type: String,
        
      },
      notes: {
        firstName: {
          type: String,
        },
        lastName: {
          type: String,
        },
        membershipType: {
          type: String,
        },
      },
    },
    { timestamps: true }
  );

  module.exports = mongoose.model("Payment", paymentSchema);