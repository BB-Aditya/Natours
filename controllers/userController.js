const User = require(`../models/userModel`);
const catchAsync = require(`../utils/catchAsync`);
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const allUsers = await User.find();

  res.status(200).json({
    status: 'success',
    allUsers,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'Internal server error',
    message: 'Not yet defined',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'Internal server error',
    message: 'Not yet defined',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Internal server error',
    message: 'Not yet defined',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Internal server error',
    message: 'Not yet defined',
  });
};
