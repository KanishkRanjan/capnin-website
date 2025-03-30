const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  image_url: { type: Array, required: true },
  name: { type: String, unique: true },
  shortDescription: { type: String, required: true },
  searchKeyWord: { type: Array, required: true },
  description: { type: String, required: true },
  productLinks: { type: Array, required: true },
  date: { type: Number, default: Date.now() },
  lowestCost: Number,
});

module.exports = mongoose.model("product", productSchema);
