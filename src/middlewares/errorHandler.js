const { ERROR_CODES } = require('../constants/error');
const { INTERNAL_SERVER_ERROR } = require('../constants/messages/error');

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    success: false,
    code: error.code || ERROR_CODES.UNKNOWN,
    name: error.name || 'Error',
    message: error.msg || INTERNAL_SERVER_ERROR,
    field: error.field || undefined,
  });
};

module.exports = errorHandler;
