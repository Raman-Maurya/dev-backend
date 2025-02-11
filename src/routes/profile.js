const express = require("express");
const profileRouter = express.Router();
const { jwtAuth } = require("../middleware/validateData");
const { validteEditProfileData } = require("../utils/auth");
const validator = require("validator");
const bcrypt = require("bcrypt");


profileRouter.get("/profile/view", jwtAuth, async(req, res)=>{
    try{
        const user = req.user;
         res.send(user);
}catch(err){
    res.status(400).send("Error: " + err.message);}
})


profileRouter.patch("/profile/update", jwtAuth, async(req, res)=>{
    try{
       if(!validteEditProfileData(req)){
        throw new Error("Cannot updated these fields: Email or Password")
       };
       const loggedInuser = req.user;
       Object.keys(req.body).forEach((field)=>{
              loggedInuser[field] = req.body[field];
       })
         await loggedInuser.save();
         res.json({message: `${loggedInuser.firstName}', your profile updated successfully`,data:loggedInuser});
    }catch(err){
        res.status(400).send("ERROR : " + err.message);

    }
})


profileRouter.patch("/profile/update/password",jwtAuth, async(req, res)=>{
    try{
        loggedInUser = req.user;
        const PassinDB = loggedInUser.password;
        const {oldPassword, newPassword} = req.body;
        const passwordMatch = await bcrypt.compare( oldPassword, PassinDB);

        if (!oldPassword || !newPassword) {
            throw new Error("Old and new passwords are required.");
        }
        if(!passwordMatch){
            throw new Error("Invalid Password");
        }
        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Password should be atleast 8 characters long and should contain atleast 1 lowercase, 1 uppercase, 1 number and 1 special character");
        }
        const passwordHash = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = passwordHash;
        await loggedInUser.save();
        res.json({message: `${loggedInUser.firstName}',Password updated successfully`});
    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
})


module.exports = profileRouter;
