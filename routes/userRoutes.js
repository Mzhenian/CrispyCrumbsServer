const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");
const videoController = require("../controllers/videosController");
const multer = require("multer");
const path = require("path");
const { verifyToken } = userController;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, "DB/videos/");
    } else if (file.mimetype.startsWith("image/")) {
      cb(null, "DB/videos/");
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// video routes
router.get("/:id/videos", verifyToken, videoController.getUserVideos); //todo remove
router.get("/:id/videos", videoController.getUserVideos);
router.post("/:id/videos", verifyToken, upload.single("videoFile"), videoController.createUserVideo);
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
// router.put("/:id/videos/:pid", videoController.editVideoById); //todo implement edit function before connecting
// router.patch("/:id/videos/:pid", videoController.editVideoById); //todo implement edit function before connecting
router.delete("/:id/videos/:videoId", verifyToken, videoController.deleteUserVideo); //todo migrate to /:id/videos/:pid
router.delete("/:id/videos/:pid", videoController.deleteUserVideo);
router.post("/", userController.signup);

//todo add comments API routes

//from here not officially required
router.post("/validateToken", userController.validateToken);
router.post("/signup", userController.signup); //todo migrate to /api/users
// router.post("/api/users", userController.signup); //todo remove
router.post("/login", userController.login);
router.post("/follow", verifyToken, userController.followUser);
router.post("/unfollow", verifyToken, userController.unfollowUser);
router.post("/isUsernameAvailable", userController.isUsernameAvailable);

module.exports = router;
