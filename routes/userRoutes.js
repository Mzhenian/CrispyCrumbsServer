const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");
const videoController = require("../controllers/videosController");
const path = require("path");
const multer = require("multer");
const { verifyToken } = userController;

// Multer storage configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, "DB/videos/"); // Correct path for video files
    } else if (file.mimetype.startsWith("image/")) {
      cb(null, "DB/thumbnails/"); // Correct path for image files (thumbnails)
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// User routes
router.get("/:id", userController.getUserDetails);
router.put("/:id", verifyToken, userController.updateUser);
router.patch("/:id", verifyToken, userController.updateUser);
router.delete("/:id", verifyToken, userController.deleteUser);

// Video routes
router.get("/:id/videos", verifyToken, videoController.getUserVideos);
router.post(
  "/:id/videos",
  verifyToken,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  (req, res, next) => {
    console.log("Received files:", req.files);
    console.log("Received body:", req.body);
    next();
  },
  videoController.createUserVideo
);

router.get("/:id/videos/:pid", videoController.getVideoById);
router.delete("/:id/videos/:videoId", verifyToken, videoController.deleteUserVideo);
router.delete("/:id/videos/:pid", verifyToken, videoController.deleteUserVideo);
router.post("/", userController.signup);

// Authentication and validation routes
router.post("/validateToken", userController.validateToken);
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/follow", verifyToken, userController.followUser);
router.post("/unfollow", verifyToken, userController.unfollowUser);
router.post("/isUsernameAvailable", userController.isUsernameAvailable);

module.exports = router;
