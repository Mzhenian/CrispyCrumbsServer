const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  videoId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  tags: [String],
  videoFile: { type: String, required: true },
  thumbnail: { type: String, required: true },
  userId: { type: String, required: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  uploadDate: { type: Date, default: Date.now },
  comments: [
    {
      commentId: String,
      userId: String,
      comment: String,
      Date: Date,
    },
  ],
  likedBy: [String],
  dislikedBy: [String],
});

module.exports = mongoose.model("Video", videoSchema);
