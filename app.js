const fs = require('fs');

const express = require('express');
const app = express();
app.use(express.json());

const port = 3000;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
  console.log('Data sent successfully');
};

const getTour = (req, res) => {
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

const createNewTour = (req, res) => {
  console.log(req.body);
  const newID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newID }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
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

const updateTour = (req, res) => {
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

const deleteTour = (req, res) => {
  const filePath = `${__dirname}/dev-data/data/tours-simple.json`;
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
////////////////////////////
///////////////////////////

app.get('/api/v1/tours', getAllTours);
app.get('/api/v1/tours/:id', getTour);
app.post('/api/v1/tours', createNewTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);

///////////////////////////////////////

app.route('/api/v1/tours').get(getAllTours).post(createNewTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.listen(port, () => {
  console.log(`App runing on port ${port}`);
});
