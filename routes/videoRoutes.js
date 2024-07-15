const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videosController");

// General video routes
router.get("/", videoController.getAllVideos);
router.get("/:id", videoController.getVideoById);
router.post("/like", videoController.likeVideo);
router.post("/dislike", videoController.dislikeVideo);

module.exports = router;
