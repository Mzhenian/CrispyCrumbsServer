const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  password: { type: String, required: true },
  profilePhoto: String,
  followers: [String],
  following: [String],
});

module.exports = mongoose.model("User", userSchema);
