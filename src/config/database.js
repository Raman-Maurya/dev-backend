const mongoose = require('mongoose');

const connectDB = async() =>{
    await mongoose.connect("mongodb+srv://mafiagamingff5:Raman123@cluster0.ssj5x.mongodb.net/devTinder")
}
module.exports = connectDB;