const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleUserId: String,
  googleProfile: Object,
});

module.exports = mongoose.model("User", userSchema);
