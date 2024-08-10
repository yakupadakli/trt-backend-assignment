const httpStatus = require('http-status');

const { ERROR_CODES } = require('../constants/error');

class ApiError extends Error {
  constructor(message, statusCode, code) {
    super(message);

    switch (statusCode) {
      case httpStatus.BAD_GATEWAY:
        this.code = ERROR_CODES.BAD_REQUEST;
        break;

      case httpStatus.NOT_FOUND:
        this.code = ERROR_CODES.NOT_FOUND;
        break;

      default:
        this.code = ERROR_CODES.UNKNOWN;
        break;
    }

    this.code = code || this.code;
    this.name = this.constructor.name;
    this.msg = message;
    this.message = message;
    this.status = statusCode;
  }
}

module.exports = ApiError;
