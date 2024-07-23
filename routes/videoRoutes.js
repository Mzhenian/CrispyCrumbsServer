const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videosController");
const userController = require("../controllers/usersController"); 
// General video routes
router.get("/", videoController.getAllVideos);
router.get("/:id", videoController.getVideoById); //todo migrate to /api/users/:id/videos/:pid

// Video features routes
router.post("/like", videoController.likeVideo);
router.post("/dislike", videoController.dislikeVideo);
router.post("/incrementViews", videoController.incrementViews);

// Comment related routes
router.post("/comment", videoController.addComment);
router.put("/comment", videoController.editComment);
router.delete("/comment", videoController.deleteComment);

// Edit and delete video routes
router.delete("/:id", userController.verifyToken, videoController.deleteVideo);

module.exports = router;
