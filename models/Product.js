const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

const productSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  intro: String,
  price: Number,
  quantity: Number,
  category: String,
  pics: [String],
});

productSchema.plugin(mongoose_fuzzy_searching, {
  fields: ["name", "intro", "category"],
});

module.exports = mongoose.model("Product", productSchema);
