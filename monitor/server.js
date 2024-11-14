const express = require('express');
const cors = require('cors');
const bodyParse = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());
app.use(bodyParse.text());

app.post('/reportData', (req, res) => {
  console.log('Data Received', req.body);
  res.status(200).send({ message: 'Data Received' });
});

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});
