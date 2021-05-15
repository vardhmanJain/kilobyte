const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  items: [
    {
      id: mongoose.Schema.Types.ObjectId,
      quantity: Number,
    },
  ],
  deliveryPersonId: mongoose.Schema.Types.ObjectId,
  customerId: mongoose.Schema.Types.ObjectId,
  status: {
    type: String,
    enum: [
      "task-created",
      "reached-store",
      "items-picked",
      "enroute",
      "delivered",
      "canceled",
    ],
    default: "task-created",
  },
  locations: [String],
});
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
