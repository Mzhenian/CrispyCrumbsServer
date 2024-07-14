const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  birthday: { type: Date, required: true },
  country: { type: String, required: true },
  profilePhoto: { type: String, required: true },
  followers: [{ type: Number, required: true }],
  following: [{ type: Number, required: true }],
  videosIds: [{ type: Number, required: true }],
  likedVideoIds: [{ type: String, required: true }],
  dislikedVideoIds: [{ type: String, required: true }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
