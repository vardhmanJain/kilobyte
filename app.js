const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
dotenv.config();
//middleware
const app = express();
app.use(express.json());
app.use(cookieParser());
//start server
app.listen(5000, () => {
  console.log("listening on port 5000");
});
//connect ot mongodb
mongoose.connect(
  process.env.MDB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) return console.error(err);
    console.log("connected to mongoDB");
  }
);
//routes
app.get("/test", (req, res) => {
  res.send("hello there");
});
//setup routes
app.use("/user", require("./routers/userRouter"));
app.use("/product", require("./routers/productRouter"));
app.use("/order", require("./routers/orderRouter"));
//kilobyte
