const httpStatus = require('http-status');

const ApiError = require('./ApiError');
const { TOO_MANY_REQUESTS } = require('../constants/messages/error');
const { ERROR_CODES } = require('../constants/error');

class TooManyRequest extends ApiError {
  code = ERROR_CODES.TOO_MANY_REQUESTS;

  constructor() {
    super(TOO_MANY_REQUESTS, httpStatus.TOO_MANY_REQUESTS);
  }
}

class NotFound extends ApiError {
  code = ERROR_CODES.NOT_FOUND;

  constructor(message) {
    super(message, httpStatus.NOT_FOUND);
  }
}

module.exports = {
  TooManyRequest,
  NotFound,
};
