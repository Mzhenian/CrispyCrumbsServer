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
      // Check if the field name is 'profilePhoto' to determine the correct directory
      const dest = file.fieldname === "profilePhoto" ? "DB/users/" : "DB/thumbnails/";
      cb(null, dest); // Correct path for image files
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
router.get("/:id", userController.getUserBasicDetails);
router.put("/:id", verifyToken, upload.single("profilePhoto"), userController.updateUser);
router.patch("/:id", verifyToken, upload.single("profilePhoto"), userController.updateUser);
router.delete("/:id", verifyToken, userController.deleteUser);

// Video routes
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

router.get("/:id/videos/", userController.getUserVideos);
router.delete("/:id/videos/:videoId", verifyToken, videoController.deleteVideo);
router.put("/:id/videos/:videoId", userController.verifyToken, videoController.editVideo);

// Authentication and validation routes
router.post("/validateToken", userController.validateToken);
router.post("/login", userController.login);
router.post("/", upload.single("profilePhoto"), userController.signup);

router.post("/follow", verifyToken, userController.followUser);
router.post("/unfollow", verifyToken, userController.unfollowUser);
router.post("/isUsernameAvailable", userController.isUsernameAvailable);
router.post("/isEmailAvailable", userController.isEmailAvailable);

module.exports = router;
