const User = require(`../models/userModel`);
const catchAsync = require(`../utils/catchAsync`);
const appError = require(`../utils/appError`);
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const sign = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STR, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];

  if (!token) return next(new appError(`You're not logged in!`, 401));

  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_STR);

  console.log(decoded);

  // const freshUser = await User.findById(decoded._id);
  // if(!freshUser) return next(new appError("The user with this token doesn't exist in DB", 404));

  next();
});

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirPassword: req.body.confirmPassword,
  });

  const token = sign(newUser._id);

  res.status(201).json({
    status: 'success',
    token: token,
    newUser: newUser,
  });
});

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  // console.log(password);
  if (!email || !password) {
    return next(new appError('Please provide valid email and password', 404));
  }

  const user = await User.findOne({ email }).select('+password');
  if (
    !user ||
    !(await user.comparePassword(password.toString(), user.password))
  ) {
    return next(new appError('Incorrect email or paasword', 404));
  }

  const token = sign(user._id);

  res.status(201).json({
    status: 'success',
    token,
  });
};
