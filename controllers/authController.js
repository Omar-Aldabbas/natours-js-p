const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(201).json({
    status: 'success',
    token,
    date: {
      user: newUser,
    },
  });
});

exports.login = (req, res, next) => {
  const { name, email, password } = req.body;

  //Check if password and email exists
  if (!email || !password) {
    return next(new AppError('PLease inter your Password and Email', 400));
  }

  //Check if user exists & password correct

  //if ok, Send token to client

  const token = '';

  res.status(200).json({
    status: 'success',
    token,
  });
};
