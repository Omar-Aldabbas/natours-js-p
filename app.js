const morgan = require('morgan');
const express = require('express');

const AppError = require('./utils/appError');
const globalErroHandler = require('./controllers/errorController');

const userRouter = require('./routes/UserRouters');
const tourRouter = require('./routes/tourRouters');
const { status } = require('express/lib/response');

const app = express();
// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

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
