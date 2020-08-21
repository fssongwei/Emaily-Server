const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleUserId: String,
  googleProfile: Object,
  facebookUserId: String,
  facebookProfile: Object,
});

module.exports = mongoose.model("User", userSchema);
