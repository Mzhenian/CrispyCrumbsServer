const Video = require("../models/videosModel");

// Get video by ID
exports.getVideoById = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findOne({ videoId: id });
    console.log(video);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit video
exports.editVideo = async (req, res) => {};

// Upload video
exports.uploadVideo = async (req, res) => {};

// Like video
exports.likeVideo = async (req, res) => {};

// Dislike video
exports.dislikeVideo = async (req, res) => {};

// Add comment
exports.addComment = async (req, res) => {};

// Edit comment
exports.editComment = async (req, res) => {};

// Delete comment
exports.deleteComment = async (req, res) => {};

// Delete video
exports.deleteVideo = async (req, res) => {};

// Increment views
exports.incrementViews = async (req, res) => {};

// Get all videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("userId", "userName profilePhoto")
      .populate("comments.userId", "userName profilePhoto");
    res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error); // Log any errors
    res.status(500).json({ error: error.message });
  }
};
