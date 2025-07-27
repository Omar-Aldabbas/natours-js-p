const mongoose = require('mongoose');

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

module.exports = Tour;
