const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  address: {
    firstName: String,
    lastName: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    country: String,
    zip: String,
  },
  product: {
    productId: String,
    name: String,
    price: String,
    pic: String,
  },
  amount: Number,
  status: String,
});

module.exports = mongoose.model("Order", orderSchema);
