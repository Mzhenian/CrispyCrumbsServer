const Video = require("../models/videosModel");

// Get video by ID
exports.getVideoById = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit video
exports.editVideo = async (req, res) => {
  const { id } = req.params;
  const updatedVideo = req.body;
  try {
    const video = await Video.findByIdAndUpdate(id, updatedVideo, { new: true });
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload video
exports.uploadVideo = async (req, res) => {
  const newVideo = new Video(req.body);
  try {
    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(400).json({ error: error.message });
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

    const liked = video.likedBy.includes(userId);
    const disliked = video.dislikedBy.includes(userId);

    if (liked) {
      video.likes -= 1;
      video.likedBy = video.likedBy.filter((id) => id !== userId);
    } else {
      video.likes += 1;
      if (disliked) {
        video.dislikes -= 1;
        video.dislikedBy = video.dislikedBy.filter((id) => id !== userId);
      }
      video.likedBy.push(userId);
    }

    await video.save();
    res.status(200).json(video);
  } catch (error) {
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

    const liked = video.likedBy.includes(userId);
    const disliked = video.dislikedBy.includes(userId);

    if (disliked) {
      video.dislikes -= 1;
      video.dislikedBy = video.dislikedBy.filter((id) => id !== userId);
    } else {
      video.dislikes += 1;
      if (liked) {
        video.likes -= 1;
        video.likedBy = video.likedBy.filter((id) => id !== userId);
      }
      video.dislikedBy.push(userId);
    }

    await video.save();
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add comment
exports.addComment = async (req, res) => {
  const { videoId, comment } = req.body;
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    video.comments.unshift(comment);
    await video.save();
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit comment
exports.editComment = async (req, res) => {
  const { videoId, updatedComment } = req.body;
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const commentIndex = video.comments.findIndex((comment) => comment.commentId === updatedComment.commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found" });
    }

    video.comments[commentIndex] = updatedComment;
    await video.save();
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  const { videoId, commentId } = req.body;
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    video.comments = video.comments.filter((comment) => comment.commentId !== commentId);
    await video.save();
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete video
exports.deleteVideo = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findByIdAndDelete(id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Increment views
exports.incrementViews = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
