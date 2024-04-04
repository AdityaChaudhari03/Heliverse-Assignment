const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  id: Number,
  first_name: String,
  last_name: String,
  email: String,  
  domain: String,
  gender: String,
  avatar: String,
  available: Boolean,
});

module.exports = mongoose.model("Team", teamSchema);
