const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  brand: String,
  rating: Number,
  numberReviews: Number,
  images: [String],
  quantity: Number,
  category: mongoose.Schema.Types.ObjectId,
  isBestSeller: Boolean,
});

module.exports = mongoose.model("Product", productSchema);
