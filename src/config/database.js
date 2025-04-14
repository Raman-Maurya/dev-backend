const mongoose = require('mongoose');
// require('dotenv').config();
require('dotenv').config({ path: '../.env' });
const connectDB = async() =>{
    await mongoose.connect(process.env.MONGO_URI)
}
module.exports = connectDB;