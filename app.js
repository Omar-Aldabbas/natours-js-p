const hpp = require('hpp');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const express = require('express');

const AppError = require('./utils/appError');
const globalErroHandler = require('./controllers/errorController');

const userRouter = require('./routes/UserRouters');
const tourRouter = require('./routes/tourRouters');
// const { status } = require('express/lib/response');

const app = express();
// MIDDLEWARES GLOBAL

// SET SECURITY HTTP HEADERS
app.use(helmet());

// DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// LIMIT REQUESTS FROM SAME API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in an hour',
});

app.use('/api', limiter);

// BODY PARSER : reading data from the body into req.body
app.use(
  express.json({
    limit: '10kb',
  }),
);

// DATA SANITIZATION AQAINST NOQSQL QUERY INJECTION & XSS ATTACKS\
app.use(mongoSanitize());

// DATA SANITIZE AGAINS malicious scripts
app.use(xss());

// PREVENT PARAMETER POLLUTION

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// SERVING STATIC FILES
app.use(express.static(`${__dirname}/public`));

// TESSTING MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErroHandler);

module.exports = app;
