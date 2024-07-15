const Video = require("../models/videosModel");
const User = require("../models/usersModel");
const mongoose = require("mongoose");

// Get video by ID
exports.getVideoById = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findOne({ videoId: id });
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all videos for a user
exports.getUserVideos = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ userId: id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const videos = await Video.find({ userId: id });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new video for a user
exports.createUserVideo = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, tags } = req.body;
  const videoFile = req.files.videoFile[0].path;
  const thumbnail = req.files.thumbnail ? req.files.thumbnail[0].path : null;

  try {
    const userId = parseInt(id, 10);

    const user = await User.findOne({ userId: userId });
      if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newVideo = new Video({
      videoId: mongoose.Types.ObjectId(),
      videoFile: `/${videoFile.split("\\").slice(1).join("/")}`,
      thumbnail: thumbnail ? `/${thumbnail.split("\\").slice(1).join("/")}` : "",
      title,
      description,
      userId: userId,
      category,
      tags,
      uploadDate: new Date(),
      views: 0,
      likes: 0,
      dislikes: 0,
      comments: [],
      likedBy: [],
      dislikedBy: [],
    });

    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (error) {
    console.error("Error creating new video:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a specific video for a user
exports.deleteUserVideo = async (req, res) => {
  const { id, videoId } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const video = await Video.findOneAndDelete({ videoId, userId: id });
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Like a video
exports.likeVideo = async (req, res) => {
  // Implementation goes here
};

// Dislike a video
exports.dislikeVideo = async (req, res) => {
  // Implementation goes here
};
