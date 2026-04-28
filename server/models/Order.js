const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,

  items: [
    {
      name: String,
      price: Number,
      qty: Number,
      image: String
    }
  ],

  total: Number,
  paymentMethod: String,
  upi: String,
  bank: String,

  status: {
    type: String,
    default: "Placed" // Placed → Shipped → Delivered
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);