const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleUserId: String,
  facebookUserId: String,
  profile: Object,
  balance: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", userSchema);
