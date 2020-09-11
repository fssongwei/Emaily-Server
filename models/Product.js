const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  intro: String,
  price: Number,
  quantity: Number,
  category: String,
  pics: [String],
});

module.exports = mongoose.model("Product", productSchema);
