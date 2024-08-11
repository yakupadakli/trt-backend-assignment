const httpStatus = require('http-status');

const ApiError = require('./ApiError');
const {
  NOT_AUTHORIZED,
  AUTHENTICATION_ERROR,
} = require('../constants/messages/error');
const { ERROR_CODES } = require('../constants/error');

class AuthorizationError extends ApiError {
  code = ERROR_CODES.NOT_AUTHORIZED;

  constructor() {
    super(NOT_AUTHORIZED, httpStatus.UNAUTHORIZED);
  }
}

class AuthenticationError extends ApiError {
  code = ERROR_CODES.AUTHENTICATION_ERROR;

  constructor() {
    super(AUTHENTICATION_ERROR, httpStatus.FORBIDDEN);
  }
}

module.exports = {
  AuthorizationError,
  AuthenticationError,
};
