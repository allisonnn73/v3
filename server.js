const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());

//routes register
require('./routes/index')(app);

app.listen(process.env.PORT, () => {
  console.log('Server run on port: ' + process.env.PORT);
});