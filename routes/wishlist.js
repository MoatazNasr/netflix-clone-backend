const Router = require("express").Router();
const wishlistSchema = require("../models/Wishlist");
const jwt = require("jsonwebtoken");
const cryptoJS = require("crypto-js");
const verifyToken = require("../utils/auth");
const catchAsync = require("../utils/catchAsync");
Router.post(
  "/",
  catchAsync(async (req, res) => {
    const newWishlist = await new wishlistSchema({
      userID: req.body.userID,
      movies: req.body.movies,
    });
    const newWishlistSaved = await newWishlist.save();
    res.status(201).json('created');
  })
);

//   id --> user id
Router.get(
  "/:id",
  verifyToken,
  catchAsync(async (req, res) => {
    const wishlist = await wishlistSchema.findOne({ userID: req.params.id });
    res.json(wishlist).status(200);
  })
);

Router.put(
  "/:wishlistid",
  verifyToken,
  catchAsync(async (req, res) => {
    const updatedWishlist = await wishlistSchema.findByIdAndUpdate(
      req.params.wishlistid,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedWishlist);
  })
);
Router.delete(
  "/:wishlistid/:movieid",
  verifyToken,
  catchAsync(async (req, res) => {
    const updatedWishlist = await wishlistSchema.findByIdAndUpdate(
        req.params.wishlistid,
      {
        $pull: { movies: { movieID: req.params.movieid } },
      },
      { new: true }
    );
    res.status(200).json(updatedWishlist);
  })
);
module.exports = Router;
