const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  mobile: {
    type: String,
    unique: true,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ["customer", "delivery", "admin"],
  },
  passwordHash: {
    type: String,
    required: true,
  },
});
const User = mongoose.model("user", userSchema);
module.exports = User;
