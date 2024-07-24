const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videosController");
const userController = require("../controllers/usersController");
const { verifyToken, verifyUserId } = userController;

// General video routes
router.get("/", videoController.getAllVideos);
router.get("/:id", videoController.getVideoById); //todo migrate to /api/users/:id/videos/:pid

// Video features routes
router.post("/like", verifyToken, verifyUserId, videoController.likeVideo);
router.post("/dislike", verifyToken, verifyUserId, videoController.dislikeVideo);
router.post("/incrementViews", verifyToken, verifyUserId, videoController.incrementViews);

// Comment related routes
router.post("/comment", verifyToken, verifyUserId, videoController.addComment);
router.put("/comment", verifyToken, verifyUserId, videoController.editComment);
router.delete("/comment", verifyToken, verifyUserId, videoController.deleteComment);

// Edit and delete video routes
router.delete("/:id", userController.verifyToken, videoController.deleteVideo);

module.exports = router;
