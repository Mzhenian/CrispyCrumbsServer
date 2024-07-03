const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  birthday: { type: Date, required: true },
  country: { type: String, required: true },
  profilePhoto: { type: String, required: true },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  videosIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  likedVideoIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  dislikedVideoIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
