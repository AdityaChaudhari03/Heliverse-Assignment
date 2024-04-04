const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  domain: String,
  gender: String,
  availability: String,
});

module.exports = mongoose.model("User", userSchema);
