const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type: String,
        enum:{
            values:["ignored", "accepted", "rejected","interested"],
            message: "{VALUE} is incorrect status type"
        }
    }
},{timestamps:true});

connectionRequestSchema.pre("save",function(next){
    const connectionRequest  = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You cannot send connection request to yourself");
}
next();
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequestModel;