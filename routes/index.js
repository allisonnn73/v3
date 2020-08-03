const scan = require('./shtats');

module.exports = app => {
  app.use('/shtats', scan);
};
