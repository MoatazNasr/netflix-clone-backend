const Router = require("express").Router();
const userSchema = require("../models/User");
const jwt = require("jsonwebtoken");
const cryptoJS = require("crypto-js");
const verifyToken = require("../utils/auth");
const catchAsync = require("../utils/catchAsync");
Router.post(
  "/register",
  catchAsync(async (req, res) => {
    const newUser = await userSchema.create({
      username: req.body.username,
      email: req.body.email,
      password: cryptoJS.AES.encrypt(
        req.body.password,
        process.env.ENCRYPTION_KEY
      ).toString(),
      age: req.body.age,
      img: req.body.img,
    });
    const newUserSaved = await newUser.save();
    res.status(201).json(newUserSaved.id);
  })
);

Router.post(
  "/login",
  catchAsync(async (req, res) => {
    const loggedInUser = await userSchema.findOne({
      email: req.body.email,
    });
    const password = cryptoJS.AES.decrypt(
      loggedInUser.password,
      process.env.ENCRYPTION_KEY
    ).toString(cryptoJS.enc.Utf8);
    if (password === req.body.password) {
      const accessToken = jwt.sign(
        {
          email: loggedInUser.email,
          id: loggedInUser.id,
          age: loggedInUser.age,
          username: loggedInUser.username,
          img: loggedInUser.img,
        },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
      );
      res.status(200).json(accessToken);
    } else {
      res.status(401).json("Invalid Credentials");
    }
  })
);

Router.put(
  "/:id",
  verifyToken,
  catchAsync(async (req, res) => {
    if (req.body.password) {
      const updatedUser = await userSchema.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            password: cryptoJS.AES.encrypt(
              req.body.password,
              process.env.ENCRYPTION_KEY
            ).toString(),
          },
        },
        { new: true, runValidators: true }
      );
      const { email, username, age, img ,_id} = updatedUser;
      res.status(200).json({ email, username, age, img ,_id});    } else {
      const updatedUser = await userSchema.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true, runValidators: true }
      );
      const { email, username, age, img ,_id} = updatedUser;
      res.status(200).json({ email, username, age, img ,_id});
    }
  })
);

Router.get(
  "/email/:userEmail",
  catchAsync(async (req, res) => {
    const foundUser = await userSchema.findOne({ email: req.params.userEmail });
    if (foundUser) res.status(200).json("Existed User");
    else res.status(204).json("User Not Found");
  })
);
module.exports = Router;
