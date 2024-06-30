const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const customEnv = require("custom-env");

customEnv.env(process.env.NODE_ENV || "default", "./config");

const server = express();

server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

server.use(express.static("public"));

const users = require("./routes/users");
const videos = require("./routes/videos");

server.use("/users", users);
server.use("/videos", videos);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
