// const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //OPERATIONAL , trusted error: send message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  //PROGRAMMING OR OTHER, untrusted error: don't send message to the client
  } else {
    //Log Error
    console.error('ERROR 🧏‍♂️', err)

    //Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  // if (!(err instanceof AppError)) {
  //   err = new AppError(err.message || 'Something went wrong', 500);
  // }

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.Node_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.Node_ENV === 'production') {
    sendErrorProd(err, res);
  }
};
