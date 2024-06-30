const Video = require("../models/videos");

const getAllVideos = async () => {
  return await Video.find();
};

const getVideoById = async (id) => {
  return await Video.findOne({ videoId: id });
};

const createVideo = async (videoData) => {
  const video = new Video(videoData);
  return await video.save();
};

const incrementViews = async (id) => {
  const video = await Video.findOne({ videoId: id });
  video.views += 1;
  return await video.save();
};

module.exports = {
  getAllVideos,
  getVideoById,
  createVideo,
  incrementViews,
};
