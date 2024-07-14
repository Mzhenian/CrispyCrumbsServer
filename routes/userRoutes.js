const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");
const videoController = require("../controllers/videosController");
const multer = require("multer");
const { verifyToken } = userController;

router.get("/:id", userController.getUserDetails);
router.put("/:id", verifyToken, userController.updateUser);
router.patch("/:id", verifyToken, userController.updateUser);
router.delete("/:id", verifyToken, userController.deleteUser);
router.post("/validateToken", userController.validateToken);
router.post("/signup", userController.signup);
router.post("/api/users", userController.signup);
router.post("/login", userController.login);
router.post("/follow", verifyToken, userController.followUser);
router.post("/unfollow", verifyToken, userController.unfollowUser);
router.post("/isUsernameAvailable", userController.isUsernameAvailable);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "DB/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// video routes
router.get("/:id/videos", verifyToken, videoController.getUserVideos);
router.post("/:id/videos", verifyToken, upload.single("videoFile"), videoController.createUserVideo);
router.delete("/:id/videos/:videoId", verifyToken, videoController.deleteUserVideo);

module.exports = router;
