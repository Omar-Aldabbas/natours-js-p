const Tour = require('../models/tourModel');
const fs = require('fs');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

exports.checkBody = (req, res, next) => {
  if (!req.body.price || !req.body.name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or Price',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  // res.status(200).json({
  //   status: 'success',
  //   requestTime: req.requestTime,
  //   result: tours.length,
  //   data: {
  //     tours,
  //   },
  // });
  console.log('Data sent successfully');
};

exports.getTour = (req, res) => {
  console.log(req.params);

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
  console.log('Data sent successfully');
};

exports.createNewTour = (req, res) => {
  console.log(req.body);

  // res.status(201).json({
  //   status: 'success',
  //   data: {
  //     tour: newTour,
  //   },
  // });
};

exports.updateTour = (req, res) => {
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour: updatedTour,
  //   },
  // });
  console.log('File updated!');
};
exports.deleteTour = (req, res) => {
  console.log('DELETE Tour');
};
