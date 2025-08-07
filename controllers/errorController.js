// const AppError = require('../utils/appError');

module.exports = (err, req, res, next) => {
  // if (!(err instanceof AppError)) {
  //   err = new AppError(err.message || 'Something went wrong', 500);
  // }

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
