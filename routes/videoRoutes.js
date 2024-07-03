const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videosController");
const { verifyToken } = videoController;

router.get("/:id", videoController.getVideoById);
router.put("/edit/:id", videoController.editVideo);
router.post("/upload", videoController.uploadVideo);
router.post("/like", videoController.likeVideo);
router.post("/dislike", videoController.dislikeVideo);
router.post("/comment/add:id", videoController.addComment);
router.put("/comment/edit:id", videoController.editComment);
router.delete("/comment/delete:id", videoController.deleteComment);
router.delete("/delete/:id", videoController.deleteVideo);
router.put("/views/:id", videoController.incrementViews);

module.exports = router;
