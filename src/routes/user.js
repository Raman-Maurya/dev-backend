const express = require("express");
const userRouter = express.Router();

const { jwtAuth } = require("../middleware/validateData");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const SAFE_USER_DATA = "firstName lastName age skills about gender photoUrl";

//get all pending connection requests of the logged in user

userRouter.get("/user/requests/received", jwtAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;
        const requests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
             status: "interested",
        }).populate("fromUserId",SAFE_USER_DATA);
        res.json({message:"data fetched successfully " , data: requests,});

    }catch(err){
        res.status(400).json({message: "Error: " + err})
    }
})


//get all connections of a user
userRouter.get("/user/allconnections", jwtAuth, async(req, res)=>{
    
    try{
        const loggedInUser = req.user;
        const allconnections = await ConnectionRequest.find({
            status: "accepted",
            $or: [
                {toUserId: loggedInUser._id},
                {fromUserId: loggedInUser._id},
            ]
        }).populate("fromUserId", SAFE_USER_DATA).populate("toUserId", SAFE_USER_DATA);
        if(allconnections.length === 0){
            return res.json({message: "No connections found"})
        }
        //i didn't need id, toUserId, status, createdAt, updatedAt so i use
        const data = allconnections.map((row)=>{
            if(row.fromUserId.equals(loggedInUser._id)       //we cannot compare to mongo id using === 
              ///row.fromUserId.toString() === loggedInUser._id.toString()

            ){           
                return row.toUserId;
            }
            return row.fromUserId;
        })
        res.json({data});
    }catch(err){
        res.status(400).json({message: "Error: "+err})
    }
})

userRouter.get("/feed", jwtAuth, async (req, res) => {
    try {
      const loggedInUser = req.user;
  
      const page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;
      limit = limit > 50 ? 50 : limit;
      const skip = (page - 1) * limit;
  
      const connectionRequests = await ConnectionRequest.find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      }).select("fromUserId  toUserId");
  
      const hideUsersFromFeed = new Set();
      connectionRequests.forEach((req) => {
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
      });
  
      const users = await User.find({
        $and: [
          { _id: { $nin: Array.from(hideUsersFromFeed) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
        .select(SAFE_USER_DATA)
        .skip(skip)
        .limit(limit);
  
      res.json({ data: users });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  module.exports = userRouter;