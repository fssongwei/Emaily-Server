const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: String,
  items: [
    {
      productId: String,
      amount: Number,
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
