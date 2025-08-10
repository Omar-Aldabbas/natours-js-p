const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHTEXCEPTION! SHUTTING DOWN .....⏳');
  console.log(err.name, err.message);
  process.exit(1); //uncleanstate
});

dotenv.config();
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB Connection Successful!'));

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App runing on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! SHUTTING DOWN .....⏳');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
