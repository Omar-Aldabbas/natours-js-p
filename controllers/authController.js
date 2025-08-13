const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    date: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Find user by email, explicitly select password (since select: false in schema)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) Check if password is correct
  const isCorrect = await user.correctPassword(password, user.password);
  if (!isCorrect || !user) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 4) If ok, generate token
  const token = signToken(user._id);

  // 5) Send response
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) Get the JWT token and check if true
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  //2) Validate token
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  console.log(decoded);

  //3) Check if user still exist
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The User belonging to this token no Longer Exists.', 401),
    );
  }
  //4) Check if user changed PW after the token issued
  if (currentUser.changesPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed Password! Pleaase log in again', 401),
    );
  }
  console.log(
    'HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH',
  );
  console.log('User role:', currentUser.role);
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action!', 403),
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  if (!req.body || !req.body.email) {
    return next(new AppError('Please provide an email address', 400));
  }

  // 1) GET user from  the POSted email
  const user = await User.findOne({ email: req.body.email });
  // 1)b Check if user exists
  if (!user) {
    return next(new AppError('There is no user with this email address', 404));
  }
  // 2) Create a resetToken
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) send the token via email to user POSTed email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password submit a PATCH request with your new password and passwordConfirm to: ${resetURL}\n
   If you didn't forget it please ignore this email.`;

  console.log('Email to send:', user.email);
  console.log('Reset token:', resetToken);
  console.log('Reset URL:', resetURL);

  try {
    await sendEmail({
      email: user.email,
      subject: 'your password reset token only valid for 10m',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token send to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending an email. Try again later!'),
      500,
    );
  }
});

exports.resetPassword = (req, res, next) => {};
