const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // _id: { type: mongoose.Types.ObjectId() },
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  birthday: { type: Date, required: true },
  country: { type: String, required: true },
  profilePhoto: { type: String, required: true },
  followers: [{ type: String, required: true, default: [] }],
  following: [{ type: String, required: true, default: [] }],
  videosIds: [{ type: String, required: true, default: [] }],
  likedVideoIds: [{ type: String, required: true, default: [] }],
  dislikedVideoIds: [{ type: String, required: true, default: [] }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
