const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const customEnv = require("custom-env");

customEnv.env(process.env.NODE_ENV || "default", "./config");

const server = express();

server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000", // specify your frontend URL
  credentials: true, // allow credentials (cookies) to be sent
};

server.use(cors(corsOptions));

mongoose
  .connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Set up session middleware
server.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // Adjust as needed
  })
);

server.use(express.static("public"));

const users = require("./routes/users");
const videos = require("./routes/videos");

server.use("/auth", users); // Assuming users.js contains the authentication routes
server.use("/videos", videos);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
