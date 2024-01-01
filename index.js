const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const userRoutes = require("./routes/user");
const wishlistRoutes = require("./routes/wishlist");
const PORT = process.env.PORT || 2000;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("database is connected");
  })
  .catch((err) => {
    console.log(err);
  });
  app.use(cors());
  app.use(express.json());
  app.use('/api/users' ,userRoutes);
  app.use('/api/wishlists' ,wishlistRoutes);
  
  app.listen(PORT, () => {
  console.log("listen at port 2000");
});
