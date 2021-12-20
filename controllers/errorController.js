const AppError = require(`./../utils/appError`);
const sendDevErr = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProdErr = (err, res) => {
  if (err.isOperational === true) {
    console.log(err);
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

const errorHandlerWebToken = () => new AppError('Invalid Token', 400);
const errorHandlerTokenExpired = () => new AppError('Token Expired', 400);
const errorHandlerDB = (error) => {
  error.status = 'fail';
  const message = ` Invalid ${error.path} : ${error.value}`;
  return new AppError(message, 404);
};

const errorHandlerDuplicate = (error) => {
  const duplicate = error.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/g)[0];
  return new AppError(`Failed due to duplicate value: ${duplicate}`, 404);
};

const errorHandlerValidation = (error) => {
  error = Object.values(error.errors)
    .map((el) => el.message)
    .join('. ');
  return new AppError(`Failed due to: ${error}`, 404);

  // (error.errors).map(el=>{
  //     console.log(el.message);
  // })
};
//  const invalidData = error.errors.map('')

exports.globalErrorHandler = function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  if (process.env.NODE_ENV === 'production') {
    let error = err;
    if (error.name === 'CastError') error = errorHandlerDB(error);
    if (error.code === 11000) error = errorHandlerDuplicate(error);
    if (error.name === 'ValidationError') error = errorHandlerValidation(error);
    if (error.name === 'JsonWebTokenError') error = errorHandlerWebToken(error);
    if (error.name === 'TokenExpiredError')
      error = errorHandlerTokenExpired(error);

    sendProdErr(error, res);
  } else if (process.env.NODE_ENV === 'development') {
    sendDevErr(err, res);
  }
};
