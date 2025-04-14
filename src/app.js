const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors  = require("cors");
require("dotenv").config({ path: "../.env" });
const http = require("http");


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "https://dev-frontend-final.onrender.com",
    credentials:true,
}));

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");
const initialiseSocket = require("./utils/socket");


const server = http.createServer(app);
initialiseSocket(server);



connectDB().then(()=>{
    console.log("Connected to Database");
    server.listen(7777,()=>{
        console.log("Server is running on port 7777");
    })

}).catch((err)=>{
    console.log("Error connecting to Database", err);
})
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",paymentRouter);
app.use("/",chatRouter);
