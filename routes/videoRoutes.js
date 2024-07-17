const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videosController");


// General video routes
router.get("/", videoController.getAllVideos);
router.get("/:id", videoController.getVideoById);//todo migrate to /api/users/:id/videos/:pid
router.post("/like", videoController.likeVideo);
router.post("/dislike", videoController.dislikeVideo);
router.post("/comment", videoController.addComment);
router.post("/incrementViews", videoController.incrementViews);

module.exports = router;
