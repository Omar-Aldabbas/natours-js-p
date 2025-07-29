const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB Connection Successful!'));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App runing on port ${port}`);
});
