const express = require("express");
const { jwtAuth } = require("../middleware/validateData");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")

requestRouter.post("/request/send/:status/:toUserId",jwtAuth, async(req, res)=>{
   try{ 
    const fromUserId = req.user._id;
    const toUserId= req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["interested", "ignored"];
    if(!allowedStatus.includes(status)){
        return res.status(400).json({message: "invalid status type" +status})
    }
    //check if the user is in our website or not to send the connection
    const toUser = await User.findById({_id:toUserId});
    if(!toUser){
        return res.status(400).json({message: "User not found"});

    }
    const ExistingConnectionReq = await ConnectionRequest.findOne({
     $or:[
        {toUserId, fromUserId},
        {toUserId:fromUserId, fromUserId:toUserId},
     ]   
    });
    if(ExistingConnectionReq){
        return res
        .status(400)
        .json({mesage: "connection request already exist"});
    }

    const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
    })
    
    const data = await connectionRequest.save();
    res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
}catch(err){
    res.status(400).send("Error: " + err.message);
}
})


requestRouter.post("/request/review/:status/:requestId", jwtAuth, async(req, res)=>{
    try{
        const {status, requestId} = req.params;
        const loggedInUser = req.user; 

        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "status not allowed"})
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        })

        if(!connectionRequest){
            return res.status(400).json({message: "request not found"})
        }


        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.status(200).json({message: "Request " + status, data});
        

    }catch(err){
        res.status(400).json({message: err})
    }
})

module.exports = requestRouter;