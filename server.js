const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB Connection Successful!'));

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour should have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4,
  },
  price: {
    type: Number,
    required: [true, 'Tour should have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Old City',
  rating: 4.5,
  price: 400,
});

testTour
  .save()
  .then((doc) => console.log(doc))
  .catch((err) => console.log(`Error: ${err}`));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App runing on port ${port}`);
});
