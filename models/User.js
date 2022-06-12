const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true ,min:10},
  img: { type: String },
},{timestamp:true});

module.exports = mongoose.model('User',userSchema);