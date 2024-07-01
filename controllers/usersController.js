const User = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

// Signup
exports.signup = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const newUser = new User({ userName, password });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, config.jwtSecret, { expiresIn: "1h" });
    res.status(201).json({ token, user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { userName, password } = req.body;
  console.log("Login request received:", req.body); // Log request body
  try {
    const user = await User.findOne({ userName });
    if (!user || user.password !== password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: "1h" });
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Middleware to verify token
exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
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

// Follow user
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

// Unfollow user
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
    res.status(200).json({ message: "User unfollowed" });
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
