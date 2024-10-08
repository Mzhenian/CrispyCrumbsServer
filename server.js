require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const router = express.Router();

const userRoutes = require("./routes/userRoutes");
const videoRoutes = require("./routes/videoRoutes");
const usersController = require("./controllers/usersController");

const config = require("./config/config");
const cors = require("cors");

const server = express();
const port = 1324;

const TCP_PORT = 5555;
const TCP_IP = "127.0.0.1";

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

// ex 4
const net = require("node:net");
const client = new net.Socket();
client.setMaxListeners(20);

client.on("error", (err) => {
  console.log("couldn't connect to the tcp server:", err.message);
});

client.on("close", () => {
  console.log("Disconnected from the TCP server");
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);

  client.connect(process.env.TCP_PORT, process.env.TCP_IP, () => {
    console.log(`Connected to the TCP server at ${process.env.TCP_IP}:${process.env.TCP_PORT}`);
  });
});
