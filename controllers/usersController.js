const User = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

// Signup - Zohar - its your part i kinda built you a base for it
exports.signup = async (req, res) => {
  const { userName, email, password, fullName, phoneNumber, birthday, country, profilePhoto } = req.body;
  try {
    const newUser = new User({
      userName,
      email,
      password,
      fullName,
      phoneNumber,
      birthday,
      country,
      profilePhoto,
    });
    await newUser.save()
    //todo decouple jwt.sign to /api/tokens
    console.log("newUser", newUser);
    const token = jwt.sign({ id: newUser._id.toString() }, config.jwtSecret, {
      expiresIn: "1h",
    });
    res.status(201).json({ token, user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({ userName });
    if (!user || user.password !== password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id.toString() }, config.jwtSecret, {
      expiresIn: "1h",
    });
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Middleware to verify token
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
      const user = await User.findById(decoded.id).select("userId userName email fullName profilePhoto videosIds");
      if (!user) {
        return res.status(404).json({ valid: false, message: "User not found" });
      }
      res.status(200).json({ valid: true, user });
    } catch (error) {
      res.status(500).json({ valid: false, message: error.message });
    }
  });
};

// Middleware to verify token for routes
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
    req.userId = decoded.id;
    next();
  });
};
// Follow user - modify
exports.followUser = async (req, res) => {
  const { userIdToFollow } = req.body;
  try {
    const currentUser = await User.findById(req.userId);
    if (currentUser.following.includes(userIdToFollow)) {
      return res.status(400).json({ error: "Already following this user" });
    }
    currentUser.following.push(userIdToFollow);
    await currentUser.save();
    await User.findByIdAndUpdate(userIdToFollow, { $push: { followers: req.userId } });
    res.status(200).json({ message: "User followed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Unfollow user - modify
exports.unfollowUser = async (req, res) => {
  const { userIdToUnfollow } = req.body;
  try {
    const currentUser = await User.findById(req.userId);
    if (!currentUser.following.includes(userIdToUnfollow)) {
      return res.status(400).json({ error: "Not following this user" });
    }
    currentUser.following = currentUser.following.filter((id) => id !== userIdToUnfollow);
    await currentUser.save();
    await User.findByIdAndUpdate(userIdToUnfollow, { $pull: { followers: req.userId } });
    res.status(200).json({ message: "User unfollow" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

// Get user details
exports.getUserDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ userId: id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
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
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
