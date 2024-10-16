const Video = require("../models/videosModel");
const User = require("../models/usersModel");
const mongoose = require("mongoose");

const net = require("node:net");
const client = new net.Socket();
const shuffleArray = require("../utils");

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

// Get video by user & ID
exports.getVideoByUserAndId = async (req, res) => {
  try {
    const video = await Video.findOne({
      _id: req.params.pid,
      userId: req.params.id,
    });
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
    const allVideos = await Video.find();

    // Sort videos by views and get top 10
    const mostViewedVideos = allVideos
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Sort videos by upload date and get top 10
    const mostRecentVideos = allVideos
      .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
      .slice(0, 10);

    // Check if user is authenticated and get their following videos
    let followingVideos = [];
    if (req.decodedUserId) {
      const user = await User.findById(req.decodedUserId);
      if (user && user.following.length > 0) {
        followingVideos = await Video.find({ userId: { $in: user.following } });
      }
    }

    // Randomly select 10 videos from the list of all videos
    const randomVideos = allVideos.sort(() => 0.5 - Math.random()).slice(0, 10);

    // Combine the lists into an object
    const combinedVideos = {
      mostViewedVideos,
      mostRecentVideos,
      followingVideos,
      randomVideos,
    };

    // Send response
    res.status(200).json(combinedVideos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get searched videos
exports.searchAllVideos = async (req, res) => {
  const { query } = req.params;
  try {
    if (!query || query === "") {
      getAllVideos(req, res);
      return;
    }

    const foundVideos = await Video.find({
      $or: [
        { $text: { $search: query } }, //the MongoDB text index is on the title and description fields.
        { title: { $regex: query, $options: "i" } },
        { tags: { $in: [query] } },
      ],
    });

    if (foundVideos.length === 0) {
      res.status(404).json({ result: "No videos found" });
    } else {
      res.status(200).json(foundVideos);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get following videos
exports.getFollowingVideos = async (req, res) => {
  try {
    // Check if user is authenticated and get their following videos
    let followingVideos = [];
    if (req.decodedUserId) {
      const user = await User.findById(req.decodedUserId);
      if (user && user.following.length > 0) {
        followingVideos = await Video.find({ userId: { $in: user.following } });
      }
    }
    // Send response
    res.status(200).json(followingVideos);
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
      thumbnail: thumbnail
        ? `/${thumbnail.split("\\").slice(1).join("/")}`
        : "",
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
  const { videoId } = req.params;
  const { title, description, category, tags } = req.body;
  const thumbnail = req.files?.thumbnail ? req.files.thumbnail[0].path : null;
  const videoFile = req.files?.videoFile ? req.files.videoFile[0].path : null;

  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    video.title = title || video.title;
    video.description = description || video.description;
    video.category = category || video.category;
    video.tags = tags ? tags.split(",").map((tag) => tag.trim()) : video.tags;
    if (thumbnail)
      video.thumbnail = `/${thumbnail.split("\\").slice(1).join("/")}`;
    if (videoFile)
      video.videoFile = `/${videoFile.split("\\").slice(1).join("/")}`;

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

  // Remove the video ID from the user's videosIds array

  try {
    const video = await Video.findByIdAndDelete(id);
    await User.findByIdAndUpdate(
      video.userId,
      { $pull: { videosIds: id } },
      { new: true }
    );

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
        video.dislikedBy = video.dislikedBy.filter(
          (id) => id.toString() !== userId
        );
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
      video.dislikedBy = video.dislikedBy.filter(
        (id) => id.toString() !== userId
      );
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
  const { videoId, commentText, date } = req.body;
  const userId = req.decodedUserId;

  try {
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const newComment = {
      commentId: new mongoose.Types.ObjectId().toString(),
      userId: userId,
      comment: commentText,
      date: new Date(date),
    };

    video.comments.push(newComment);
    await video.save();

    res.status(200).json(newComment);
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

    const comment = video.comments.find(
      (comment) => comment.commentId === commentId && comment.userId === userId
    );

    // Log the comment to be edited
    console.log("Comment found:", comment);

    if (!comment) {
      return res
        .status(404)
        .json({ error: "Comment not found or user not authorized" });
    }

    comment.comment = req.body.comment;
    comment.date = new Date(); // Update the date to the current date

    // Log the updated comment
    console.log("Updated comment object:", comment);

    await video.save();

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

    const commentIndex = video.comments.findIndex(
      (comment) => comment.commentId === commentId && comment.userId === userId
    );
    if (commentIndex === -1) {
      return res
        .status(404)
        .json({ error: "Comment not found or user not authorized" });
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
  const userId = req.decodedUserId; // May be undefined if user is not logged in

  try {
    const video = await Video.findById(videoId);
    const user = userId ? await User.findById(userId) : null;

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    // Update MongoDB
    if (!user) {
      video.views += 1;
    } else {
      lastViewed = user.watchHistory.lastIndexOf(videoId);
      if (lastViewed === -1) {
        //sees the video for the first time
        user.watchHistory.push(videoId);
        video.views += 1;
      } else if (lastViewed !== user.watchHistory.length - 1) {
        user.watchHistory.splice(lastViewed, 1);
        user.watchHistory.push(videoId);
        video.views += 1;
      } //else it's the he watch again the same video, so don't update DB
      user.save({ validateModifiedOnly: true });
    }
    video.save({ validateModifiedOnly: true });

    // Send message to the C++ server
    const client = new net.Socket();

    client.connect(process.env.TCP_PORT, process.env.TCP_IP, () => {
      console.log("Connected to the C++ server");
      let message;

      message = `${JSON.stringify({
        action: "viewed",
        videoId,
        views: video.views,
      })}\n`;
      client.write(message);
      console.log(`Sent message: ${message}`);

      if (user) {
        message = `${JSON.stringify({
          action: "watching",
          userId,
          watchHistory: user.watchHistory,
        })}\n`;
        client.write(message);
        console.log(`Sent message: ${message}`);
      }
    });

    // client.on("data", (data) => {
    //   console.log(`Received from C++ server: ${data.toString()}`);
    //   client.end(); // Close connection after receiving the response
    // });

    client.on("error", (err) => {
      console.error("Error connecting to the C++ server: ", err.message);
    });

    client.on("close", () => {
      console.log("Connection to C++ server closed");
    });

    // Return the video details after updating views
    res.status(200).json(video);
  } catch (error) {
    console.error("Error in incrementViews:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getRecommendations = async (req, res) => {
  const { videoId } = req.params;
  const userId = req.decodedUserId;

  try {
    // Send request to the C++ server
    const client = new net.Socket();
    const user = userId ? await User.findById(userId) : null;

    client.connect(process.env.TCP_PORT, process.env.TCP_IP, () => {
      if (user) {
        const message = `${JSON.stringify({
          action: "get recommendations",
          watchHistory: user.watchHistory ? user.watchHistory : [],
          videoId,
        })}\n`;
        client.write(message);
      } else {
        const message = `${JSON.stringify({
          action: "get recommendations",
          videoId,
        })}\n`;
        client.write(message);
      }
    });

    client.on("data", async (data) => {
      const response = data.toString();
      client.end(); // Close connection after receiving the response

      const parsedResponse = JSON.parse(response);

      if (!"recommendedVideosList" in parsedResponse) {
        res.status(500).json({ error: "Failed to get recommendations" });
      }

      const recommendedVideoIds = parsedResponse.recommendedVideosList;

      // Fetch video details from MongoDB
      const videos = await Video.find({ _id: { $in: recommendedVideoIds } });

      // Sort videos by views (popularity) descending
      videos.sort((a, b) => b.views - a.views);

      // If less than 10 videos, fill with random videos
      if (videos.length < 10) {
        const excludeIds = [
          ...videos.map((v) => v._id.toString()),
          videoId, // Exclude the current video
        ];
        const additionalVideos = await Video.aggregate([
          {
            $match: {
              _id: {
                $nin: excludeIds.map((id) => mongoose.Types.ObjectId(id)),
              },
            },
          },
          { $sample: { size: 10 - videos.length } },
        ]);
        videos.push(...additionalVideos);
      }

      // Limit to 10 videos and shuffle the array
      const recommendedVideos = videos.slice(0, 10);
      arr = shuffleArray(recommendedVideos);
      res.status(200).json(arr);
    });

    client.on("error", (err) => {
      console.error("Error connecting to the C++ server: ", err.message);
      res
        .status(500)
        .json({ error: "Error connecting to the recommendations server" });
    });
  } catch (error) {
    console.error("Error in getRecommendations:", error);
    res.status(500).json({ error: error.message });
  }
};
