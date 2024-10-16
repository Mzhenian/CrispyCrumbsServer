const User = require("../models/usersModel");
const Video = require("../models/videosModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

// Signup
exports.signup = async (req, res) => {
  const { userName, email, password, fullName, phoneNumber, birthday, country } = req.body;
  const profilePhoto = req.file ? req.file.path : null;

  try {
    const newUser = new User({
      userName,
      email,
      password,
      fullName,
      phoneNumber,
      birthday,
      country,
      profilePhoto: profilePhoto ? `/${profilePhoto.split("\\").slice(1).join("/")}` : "",
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id.toString() }, config.jwtSecret, { expiresIn: "30d" });

    res.status(201).json({ token, user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Login
exports.login = async (req, res) => {
  const { userName, password, rememberMe } = req.body;
  try {
    const user = await User.findOne({ userName });
    if (!user || user.password !== password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const tokenOptions = rememberMe ? { expiresIn: "30d" } : { expiresIn: "1h" };
    const token = jwt.sign({ id: user._id.toString() }, config.jwtSecret, tokenOptions);

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ValidateToken
exports.validateToken = (req, res) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ valid: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ valid: false, message: "No token provided" });
  }

  jwt.verify(token, config.jwtSecret, async (err, decoded) => {
    if (err) {
      return res.status(500).json({ valid: false, message: "Failed to authenticate token" });
    }
    try {
      const user = await User.findById(decoded.id).select(
        "userId userName email fullName profilePhoto phoneNumber videosIds birthday country"
      );
      if (!user) {
        return res.status(404).json({ valid: false, message: "User not found" });
      }
      res.status(200).json({ valid: true, user });
    } catch (error) {
      res.status(500).json({ valid: false, message: error.message });
    }
  });
};

// Check if username is available
exports.isUsernameAvailable = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ userName: username });
    res.status(200).json({ available: !user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

// Check if email is available
exports.isEmailAvailable = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    res.status(200).json({ available: !user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

// Get user details
exports.getUserBasicDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id }).select(
      "-password  -following -videosIds -likedVideoIds -dislikedVideoIds -email -fullName -phoneNumber -birthday -country"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user details
exports.getUserDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all videos for a user with detailed information
exports.getUserVideos = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const videoIds = user.videosIds;

    const videoDetailsPromises = videoIds.map(async (videoId) => {
      const video = await Video.findById(videoId);
      return video;
    });

    const videoDetails = await Promise.all(videoDetailsPromises);
    res.status(200).json(videoDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  if (req.file) {
    updateData.profilePhoto = `/${req.file.path.split("\\").slice(1).join("/")}`;
  }

  try {
    if (!updateData.password) {
      delete updateData.password;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    // Find the user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete all videos associated with the user
    await Video.deleteMany({ userId: id });

    // Remove the user's comments from all videos
    await Video.updateMany({ "comments.userId": id }, { $pull: { comments: { userId: id } } });

    // Remove the user from other users' followers and following lists
    await User.updateMany({ followers: id }, { $pull: { followers: id } });
    await User.updateMany({ following: id }, { $pull: { following: id } });

    // Remove the user's ID from likedBy and dislikedBy lists in videos
    await Video.updateMany({ likedBy: id }, { $pull: { likedBy: id }, $inc: { likes: -1 } });
    await Video.updateMany({ dislikedBy: id }, { $pull: { dislikedBy: id }, $inc: { dislikes: -1 } });

    // Delete the user
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User, videos, comments, and associated data deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.followUnfollowUser = async (req, res) => {
  const { userId } = req.body;
  const userIdToModify = req.decodedUserId;
  const isCurrentlyFollowing = await User.exists({ _id: userId, followers: userIdToModify });

  try {
    const updateOperation = isCurrentlyFollowing ? "$pull" : "$push";

    await User.findByIdAndUpdate(userId, {
      [updateOperation]: { followers: userIdToModify },
    });

    await User.findByIdAndUpdate(userIdToModify, {
      [updateOperation]: { following: userId },
    });

    res.status(200).json({ message: `Successfully ${isCurrentlyFollowing ? "unfollowed" : "followed"} user` });
  } catch (error) {
    console.error("Error updating follow status:", error);
    res.status(500).json({ error: error.message });
  }
};

// Check if a user follows another user
exports.isFollowing = async (req, res) => {
  const { userIdToCheck } = req.body;
  const userId = req.decodedUserId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isFollowing = user.following.includes(userIdToCheck);
    res.status(200).json({ isFollowing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify token for routes
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(500).json({ error: "Failed to authenticate token" });
    }
    req.decodedUserId = decoded.id.toString();
    next();
  });
};

// Check if the userId in the request matches the userId from the token
exports.verifyUserId = (req, res, next) => {
  if (req.params.id && req.params.id !== req.decodedUserId) {
    return res.status(403).json({ error: "User ID does not match the token" });
  }
  next();
};
