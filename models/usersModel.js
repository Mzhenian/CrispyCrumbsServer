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
  followers: [{ type: Number, required: true, default: [] }],
  following: [{ type: Number, required: true, default: [] }],
  videosIds: [{ type: Number, required: true, default: [] }],
  likedVideoIds: [{ type: String, required: true, default: [] }],
  dislikedVideoIds: [{ type: String, required: true, default: [] }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
