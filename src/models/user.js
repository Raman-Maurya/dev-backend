const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Userschema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minlength: 3,
    },
    lastName:{
        type: String,
    },
    emailId:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true
    },
    age:{
        type: Number,
        min: 18,
    },
    password:{
        type: String,
        required: true,
        minlength: 8,
    },
    photoUrl:{
        type: String,
        default: "www.myprofilephoto.com"
    },
    Skills:{
        type: [String],
    },
    about:{
        type: String,
        maxlength: 200,
        default:"About Section"
    },
},{timestamps: true});

Userschema.methods.getJWT = async function(){
    const user = this;
   const token = await jwt.sign({_id:user._id}, "Signature#@12", {expiresIn: "7d"});
   return token;
    
}

module.exports = mongoose.model("User", Userschema);