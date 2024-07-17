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
    const user = await User.findById(id);
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
  const videoFile = req.file.path;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const newVideo = new Video({
      videoFile,
      title,
      description,
      userId: id,
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

// Like video
exports.likeVideo = async (req, res) => {
  const { videoId, userId } = req.body;
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const likedBy = video.likedBy.map((id) => id.toString());
    const dislikedBy = video.dislikedBy.map((id) => id.toString());

    if (likedBy.includes(userId)) {
      video.likes -= 1;
      video.likedBy = video.likedBy.filter((id) => id.toString() !== userId);
    } else {
      video.likes += 1;
      video.likedBy.push(userId);
      if (dislikedBy.includes(userId)) {
        video.dislikes -= 1;
        video.dislikedBy = video.dislikedBy.filter((id) => id.toString() !== userId);
      }
    }

    await video.save({ validateBeforeSave: false }); // Skip validation to avoid the comments validation issue
    res.status(200).json(video);
  } catch (error) {
    console.error("Error in likeVideo:", error);
    res.status(500).json({ error: error.message });
  }
};

// Dislike video
exports.dislikeVideo = async (req, res) => {
  const { videoId, userId } = req.body;
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const likedBy = video.likedBy.map((id) => id.toString());
    const dislikedBy = video.dislikedBy.map((id) => id.toString());

    if (dislikedBy.includes(userId)) {
      video.dislikes -= 1;
      video.dislikedBy = video.dislikedBy.filter((id) => id.toString() !== userId);
    } else {
      video.dislikes += 1;
      video.dislikedBy.push(userId);
      if (likedBy.includes(userId)) {
        video.likes -= 1;
        video.likedBy = video.likedBy.filter((id) => id.toString() !== userId);
      }
    }

    await video.save({ validateBeforeSave: false });
    res.status(200).json(video);
  } catch (error) {
    console.error("Error in dislikeVideo:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.addComment = async (req, res) => {
  const { videoId, userId, commentText } = req.body;
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const newComment = {
      commentId: Date.now().toString(),
      userId,
      comment: commentText,
      date: new Date(), // Ensure the date is provided
    };

    video.comments.push(newComment);
    await video.save();
    res.status(200).json(video);
  } catch (error) {
    console.error("Error in addComment:", error);
    res.status(500).json({ error: error.message });
  }
};


// Increment video views
exports.incrementViews = async (req, res) => {
  const { videoId } = req.body;
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    video.views += 1;
    await video.save({ validateModifiedOnly: true }); // Skip validation for unmodified fields
    res.status(200).json(video);
  } catch (error) {
    console.error("Error in incrementViews:", error);
    res.status(500).json({ error: error.message });
  }
};






