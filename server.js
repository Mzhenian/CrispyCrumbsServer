const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const userRoutes = require("./routes/userRoutes");
const videoRoutes = require("./routes/videoRoutes");
const usersController = require("./controllers/usersController");

const config = require("./config/config");
const cors = require("cors");

const server = express();
const port = 1324;

server.use(cors());
server.use(bodyParser.json());
server.use("/api/users", userRoutes);
server.use("/api/videos", videoRoutes);
router.post("/api/tokens", usersController.login);

mongoose.set("strictQuery", true);

mongoose
  .connect(config.mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

server.use("/api/db", express.static(path.join(__dirname, "DB")));

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
