const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  locations: [String],
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
