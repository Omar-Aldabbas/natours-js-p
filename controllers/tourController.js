const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkBody = (req, res, next) => {
  if (!req.body.price || !req.body.name) {
    return res.status(400).json({
      status: 'fail',
      message: 'MIssing name or Price',
    });
  }
  next();
};

exports.checkID = (req, res, next, val) => {
  console.log(`Tour ID is : ${val}`);

  if (req.params.id * 1 <  0 || req.params.id * 1 > tours.length -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    result: tours.length,
    data: {
      tours,
    },
  });
  console.log('Data sent successfully');
};

exports.getTour = (req, res) => {
  console.log(req.params);

  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
  console.log('Data sent successfully');
};

exports.createNewTour = (req, res) => {
  console.log(req.body);
  const newID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newID }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: 'fail',
          message: 'Server Error',
        });
      }

      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  //Get ID
  const id = Number(req.params.id);
  //Read tours for id
  // get the tour
  const tourIndex = tours.findIndex((el) => el.id === id);

  if (tourIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: "Server Error Can't Update",
    });
  }
  const updatedTour = { ...tours[tourIndex], ...req.body };
  tours[tourIndex] = updatedTour;
  console.log('File bending!');
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: 'fail',
          message: "Server Error Can't Update",
        });
      }
      res.status(200).json({
        status: 'success',
        data: {
          tour: updatedTour,
        },
      });
      console.log('File updated!');
    }
  );
};

exports.deleteTour = (req, res) => {
  const filePath = `${__dirname}/../dev-data/data/tours-simple.json`;
  const id = Number(req.params.id);
  const newTours = tours.filter((t) => t.id !== id);

  if (newTours.length === tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Tour not found' });
  }
  fs.writeFile(filePath, JSON.stringify(newTours), (err) => {
    if (err) {
      return console.log(err.message);
    }
    res.status(204).end();
  });
};
