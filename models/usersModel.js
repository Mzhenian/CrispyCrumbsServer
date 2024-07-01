const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  videosIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  likedVideoIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  dislikedVideoIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
