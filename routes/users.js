const express = require("express");
const router = express.Router();
const User = require("../models/users");

router.get("/", async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.json(user);
});

router.post("/", async (req, res) => {
  const user = await userService.createUser(req.body);
  res.json(user);
});

module.exports = router;
