const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const Tour = require('../../models/tourModel');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB CONNECTED'));

//READ FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

// Import data to DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data imported Successfully!');
    process.exit();
  } catch (err) {
    console.log('Importing Failed!', err);
    process.exit();
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Deleted Successfully!');
    process.exit();
  } catch (err) {
    console.log('Deleting Failed!');
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
