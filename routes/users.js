const express = require("express");
const router = express.Router();
const User = require("../models/users");

// Mock function to find a user
const findUserByUsername = async (username) => {
  return await User.findOne({ userName: username });
};

const findUserById = async (id) => {
  return await User.findOne({ userId: id });
};

// Login endpoint
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await findUserByUsername(username);

  if (user && user.password === password) {
    req.session.user = user; // Set user in session
    res.json({ user, session: req.sessionID });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// Logout endpoint
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

// Signup endpoint
router.post("/signup", async (req, res) => {
  const userData = req.body;
  const userExists = await findUserByUsername(userData.userName);

  if (userExists) {
    return res.status(400).json({ message: "Username already taken" });
  }

  const newUser = new User({
    ...userData,
    userId: (await User.countDocuments()) + 1, // Ensure userId is unique
    followers: [],
    following: [],
    videosIds: [],
    likedVideoIds: [],
    dislikedVideoIds: [],
  });

  await newUser.save();
  req.session.user = newUser; // Set new user in session
  res.json({ user: newUser, session: req.sessionID });
});

// Fetch current user endpoint
router.get("/current-user", (req, res) => {
  if (req.session && req.session.user) {
    // Check if session and user exist
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: "No user logged in" });
  }
});

// Check username availability endpoint
router.get("/check-username/:username", async (req, res) => {
  const username = req.params.username;
  const userExists = await findUserByUsername(username);

  res.json({ available: !userExists });
});

module.exports = router;
