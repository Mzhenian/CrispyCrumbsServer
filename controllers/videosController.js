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
  const videoFile = req.files.videoFile ? req.files.videoFile[0].path : null;
  const thumbnail = req.files.thumbnail ? req.files.thumbnail[0].path : null;

  // Validate that all required fields have values
  if (!userId || !title || !description || !category || !videoFile) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if the user ID from the token matches the user ID in the request body
  if (userId !== req.decodedUserId) {
    return res.status(403).json({ error: "User ID does not match token" });
  }

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
      tags: tags.split(",").map((tag) => tag.trim()), // Split and trim tags
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

exports.editVideo = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, tags } = req.body;
  const thumbnail = req.files && req.files.thumbnail ? req.files.thumbnail[0].path : null;
  const videoFile = req.files && req.files.videoFile ? req.files.videoFile[0].path : null;

  try {
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    video.title = title;
    video.description = description;
    video.category = category;
    video.tags = tags;
    if (thumbnail) video.thumbnail = `/${thumbnail.split("\\").slice(1).join("/")}`;
    if (videoFile) video.videoFile = `/${videoFile.split("\\").slice(1).join("/")}`;

    await video.save();

    res.status(200).json(video);
  } catch (error) {
    console.error("Error editing video:", error);
    res.status(500).json({ error: error.message });
  }
};


// Delete a specific video
exports.deleteVideo = async (req, res) => {
  const { id } = req.params;

  try {
    const video = await Video.findByIdAndDelete(id);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
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
  const { videoId, userId, commentText, date } = req.body;
  
  try {
    const video = await Video.findById(videoId);
    
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    const newComment = {
      commentId: Date.now().toString(),
      userId,
      comment: commentText,
      date: new Date(date), // Ensure the date is correctly parsed
    };
    
    video.comments.push(newComment);
    await video.save();
    
    res.status(200).json(video);
  } catch (error) {
    console.error("Error in addComment:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.editComment = async (req, res) => {
  const { videoId, commentId, userId, commentText } = req.body;

  // Log the received request body for debugging
  console.log("Received request body:", req.body);

  try {
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const comment = video.comments.find(comment => comment.commentId === commentId && comment.userId === userId);

    // Log the comment to be edited
    console.log("Comment found:", comment);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found or user not authorized" });
    }

    comment.comment = req.body.comment;
    comment.date = new Date(); // Update the date to the current date

    // Log the updated comment
    console.log("Updated comment object:", comment);

    await video.save();

    // Log the video object after updating the comment
    console.log("Updated video object:", video);

    res.status(200).json(video);
  } catch (error) {
    console.error("Error in editComment:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  const { videoId, commentId, userId } = req.body;
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const commentIndex = video.comments.findIndex(comment => comment.commentId === commentId && comment.userId === userId);
    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found or user not authorized" });
    }

    video.comments.splice(commentIndex, 1);
    await video.save();
    res.status(200).json(video);
  } catch (error) {
    console.error("Error in deleteComment:", error);
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






