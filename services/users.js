const User = require("../models/users");

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const getAllUsers = async () => {
  return await User.find();
};

const getUserById = async (id) => {
  return await User.findOne({ userId: id });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
};
