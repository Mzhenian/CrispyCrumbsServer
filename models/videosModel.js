const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  commentId: { type: Number, required: true, unique: true },
  userId: { type: Number, required: true },
  comment: { type: String, required: true },
  date: { type: Date, required: true },
});

const videoSchema = new mongoose.Schema({
  videoId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  videoFile: { type: String, required: true },
  thumbnail: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: Number, required: true },
  views: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  tags: { type: [String], required: true },
  category: { type: String, required: true },
  uploadDate: { type: Date, required: true },
  comments: [commentSchema],
  likedBy: [{ type: Number, required: true }],
  dislikedBy: [{ type: Number, required: true }],
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
