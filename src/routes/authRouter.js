const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const {validateData} = require("../utils/auth");
const User = require("../models/user");
const validator = require("validator");

authRouter.post("/signup", async(req,res)=>{
    try{
        validateData(req);
        const{emailId,password, firstName} = req.body;
        const existingUser = await User.findOne({emailId:emailId});
        if(existingUser){
            return res.status(400).json({message:"User already exists"})
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            emailId,
            password:passwordHash,
        })
        const savedUser = await newUser.save();
        const token = await savedUser.getJWT();
        res.cookie("token", token, {expires: new Date(Date.now() + 8*3600000),
            sameSite: 'None',
            secure: true
        });   //can be https only
        res.json({ message: "User Added successfully!", data: savedUser });        
    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
})
authRouter.post("/login",async(req, res)=>{
    try{
        const{emailId, password} = req.body;
        const emailvalid = await validator.isEmail(emailId);
        if(!emailvalid){
            throw new Error("Invalid Email Id");
        }
        const userinDB = await User.findOne({emailId:emailId});    
        if(!userinDB){
            throw new Error("Please Signup first");
        }
        const passwordMatch = await bcrypt.compare(password, userinDB.password);
        if(passwordMatch){
            const token = await userinDB.getJWT();
            res.cookie("token", token,{expires: new Date(Date.now() + 8*3600000), sameSite: 'None',
                secure: true});   //can be https only
            res.status(200).send("Login Successful");
        }else{
            throw new Error("Invalid Password");
        }
        
    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
})

authRouter.post("/logout", async(req, res)=>{
        res.cookie("token",null,{expires: new Date(Date.now()),
        });
        res.send("Logged out successfully");
})



module.exports = authRouter;