const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
dotenv.config({ path: `${__dirname}/config.env` });
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date();
  next();
});
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

exports.getHome = (req, res) => {
  res
    .status(200)
    .json({ message: ' Hello from the server! ', status: '200 Ok' });
};

exports.postHome = (req, res) => {
  res.json({
    status: 'success',
    RequestTime: req.requestTime,
    message: 'Response for the Post request ',
  });
};

module.exports = app;
