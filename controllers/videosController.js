const Video = require("../models/videosModel");
const User = require("../models/usersModel");
const mongoose = require("mongoose");

// Get video by ID
exports.getVideoById = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findOne({ _id: id });
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
  const { userId, title, description, category, tags } = req.body;
  const videoFile = req.files.videoFile[0].path;
  const thumbnail = req.files.thumbnail ? req.files.thumbnail[0].path : null;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newVideo = new Video({
      videoId: new mongoose.Types.ObjectId(),
      videoFile: `/${videoFile.split("\\").slice(1).join("/")}`,
      thumbnail: thumbnail ? `/${thumbnail.split("\\").slice(1).join("/")}` : "",
      title,
      description,
      userId: userId.toString(), // Ensure userId is stored as a string
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

    // Add the new video's ID to the user's videosIds array
    user.videosIds.push(newVideo._id);
    await user.save();

    res.status(201).json(newVideo);
  } catch (error) {
    console.error("Error creating new video:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a specific video for a user
exports.deleteUserVideo = async (req, res) => {
  const { uid, videoId } = req.params;
  try {
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const video = await Video.findOneAndDelete({ _id: videoId, userId: uid });
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
