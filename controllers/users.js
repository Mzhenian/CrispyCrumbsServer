const User = require("../models/users");

const getAllUsers = async () => {
  return await User.find();
};

const getUserById = async (id) => {
  return await User.findOne({ userId: id });
};

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
};
