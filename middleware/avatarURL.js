const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  avatarURL: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
