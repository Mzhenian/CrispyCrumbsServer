const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");
const { verifyToken } = userController;

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/follow", verifyToken, userController.followUser);
router.post("/unfollow", verifyToken, userController.unfollowUser);
router.post("/isUsernameAvailable", userController.isUsernameAvailable);

module.exports = router;
