const userRouter = require('./routes/UserRouters');
const tourRouter = require('./routes/tourRouters');

const morgan = require('morgan');
const express = require('express');
const app = express();

const port = 3000;

// MIDDLEWARES
app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the Middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
