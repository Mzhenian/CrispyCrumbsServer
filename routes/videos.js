const express = require("express");
const router = express.Router();
const videoService = require("../models/videos");

router.get("/", async (req, res) => {
  const videos = await videoService.getAllVideos();
  res.json(videos);
});

router.get("/:id", async (req, res) => {
  const video = await videoService.getVideoById(req.params.id);
  res.json(video);
});

router.post("/", async (req, res) => {
  const video = await videoService.createVideo(req.body);
  res.json(video);
});

router.patch("/:id/views", async (req, res) => {
  const video = await videoService.incrementViews(req.params.id);
  res.json(video);
});

module.exports = router;
