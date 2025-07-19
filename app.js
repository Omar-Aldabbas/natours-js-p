const express = require('express');

const app = express();

const port = 3000;


app.get('/', (req, res) => {
  const date = new Date();
  res.status(200).json({message: 'hello form express', app: 'express', date: date.toISOString()})
})








app.listen(port, () => {
  console.log(`App runing on port ${port}`);
});

