const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");
const videoController = require("../controllers/videosController");
const multer = require("multer");
const path = require("path");
const { verifyToken } = userController;

router.get("/:id", userController.getUserDetails);
router.put("/:id", verifyToken, userController.updateUser);
router.patch("/:id", verifyToken, userController.updateUser);
router.delete("/:id", verifyToken, userController.deleteUser);
router.post("/validateToken", userController.validateToken);
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/follow", verifyToken, userController.followUser);
router.post("/unfollow", verifyToken, userController.unfollowUser);
router.post("/isUsernameAvailable", userController.isUsernameAvailable);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "DB/videos/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// video routes
router.get("/:id/videos", videoController.getUserVideos);
router.post(
  "/:id/videos",
  verifyToken,
  upload.single("videoFile"),
  (req, res, next) => {
    console.log("Received file:", req.file);
    console.log("Received body:", req.body);
    next();
  },
  videoController.createUserVideo
);
router.delete("/:id/videos/:videoId", verifyToken, videoController.deleteUserVideo);

module.exports = router;
