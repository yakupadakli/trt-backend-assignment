const mongoose = require('mongoose');

const mongoErrorHandler = (err, req, res, next, CustomError) => {
  if (err instanceof mongoose.Error.CastError) {
    return next(new CustomError());
  }
  next(err);
};

module.exports = mongoErrorHandler;
