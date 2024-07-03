const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  commentId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
  date: { type: Date, required: true },
});

const videoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  videoFile: { type: String, required: true },
  thumbnail: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  views: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  tags: { type: [String], required: true },
  category: { type: String, required: true },
  uploadDate: { type: Date, required: true },
  comments: [commentSchema],
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
