const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true, unique: true },
    movies: [
      {
        movieID: { type: String, required: true },
        type: { type: String, required: true },
      },
    ],
  },
  { timestamp: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
