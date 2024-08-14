const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");
const videoController = require("../controllers/videosController");
const path = require("path");
const multer = require("multer");
const { verifyToken, verifyUserId } = userController;

// setup storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, "DB/videos/");
    } else if (file.mimetype.startsWith("image/")) {
      const dest = file.fieldname === "profilePhoto" ? "DB/users/" : "DB/thumbnails/";
      cb(null, dest);
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
router.get("/basic/:id", userController.getUserBasicDetails);

router.put("/:id", verifyToken, verifyUserId, upload.single("profilePhoto"), userController.updateUser);
router.patch("/:id", verifyToken, verifyUserId, upload.single("profilePhoto"), userController.updateUser);
router.delete("/:id", verifyToken, verifyUserId, userController.deleteUser);

// Video routes
router.get("/:id/videos/:pid", videoController.getVideoByUserAndId);
router.get("/:id/videos/", userController.getUserVideos);
router.post(
  "/:id/videos",
  verifyToken,
  verifyUserId,
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
router.delete("/:id/videos/:videoId", verifyToken, verifyUserId, videoController.deleteVideo);
router.put(
  "/:id/videos/:videoId",
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  verifyToken,
  verifyUserId,
  videoController.editVideo
);
router.patch(
  "/:id/videos/:videoId",
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  verifyToken,
  verifyUserId,
  videoController.editVideo
);

// Authentication and validation routes
router.post("/validateToken", userController.validateToken);
router.post("/tokens", userController.login);
router.post("/", upload.single("profilePhoto"), userController.signup);

router.post("/follow", verifyToken, verifyUserId, userController.followUnfollowUser);
router.post("/unfollow", verifyToken, verifyUserId, userController.followUnfollowUser);
router.post("/isFollowing", verifyToken, verifyUserId, userController.isFollowing);

router.post("/isUsernameAvailable", userController.isUsernameAvailable);
router.post("/isEmailAvailable", userController.isEmailAvailable);

module.exports = router;
