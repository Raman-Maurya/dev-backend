const validator = require("validator");

const validateData = (req)=>{
    try{
        const{firstName, emailId, password} = req.body;
    if(!firstName || !emailId || !password){
       throw new Error("All fields are mandatory");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Invalid Email Id"); 
}else if(!validator.isStrongPassword(password)){
     throw new Error("Password should be atleast 8 characters long and should contain atleast 1 lowercase, 1 uppercase, 1 number and 1 special character");
    }}catch(err){
        throw new Error(err.message);
    }
}

const validteEditProfileData = (req)=>{
    try{
        const allowedEditFields = ["firstName", "lastName", "age", "photoUrl", "favouritePlaces", "about","gender","skills"];
        //const fields = Object.keys(req.body); //fields send by user in req.body
        const isEditAllowed = Object.keys(req.body).every((field)=> allowedEditFields.includes(field)); //gives a boolean
        return isEditAllowed;

    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
}



module.exports = {validateData, validteEditProfileData}