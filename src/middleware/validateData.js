const User = require("../models/user");
const jwt = require("jsonwebtoken");


const jwtAuth = async(req, res, next)=>{
   try{
    const cookie = req.cookies;
     const{token} = cookie;
     if(!token){
         throw new Error("Please login first");
     }
    const decodedMsg = await jwt.verify(token, "Signature#@12");
    const{_id} = decodedMsg;
   if(!_id){
       throw new Error("Session Expired Login again");
   }
   const user = await User.findById({_id:_id});
   if(!user){
       throw new Error("User not found");
   }
   req.user = user;
   next();
}catch(err){
    res.status(401).send("Please login first");
}}
module.exports = {
    jwtAuth,
}
