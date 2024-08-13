const httpStatus = require('http-status');

const ApiError = require('./ApiError');
const {
  USER_EMAIL_OR_PASSWORD_INCORRECT,
  USER_ALREADY_EXISTS,
  CURRENT_PASSWORD_INCORRECT,
} = require('../constants/messages/error');
const { ERROR_CODES } = require('../constants/error');

class EmailOrPasswordIncorrectError extends ApiError {
  code = ERROR_CODES.USER_EMAIL_OR_PASSWORD_INCORRECT;

  constructor() {
    super(USER_EMAIL_OR_PASSWORD_INCORRECT, httpStatus.UNAUTHORIZED);
  }
}

class UserAlreadyExistsError extends ApiError {
  code = ERROR_CODES.USER_ALREADY_EXISTS;

  constructor() {
    super(USER_ALREADY_EXISTS, httpStatus.BAD_REQUEST);
  }
}

class CurrentPasswordIncorrectError extends ApiError {
  code = ERROR_CODES.CURRENT_PASSWORD_INCORRECT;

  constructor() {
    super(CURRENT_PASSWORD_INCORRECT, httpStatus.UNAUTHORIZED);
  }
}

module.exports = {
  EmailOrPasswordIncorrectError,
  UserAlreadyExistsError,
  CurrentPasswordIncorrectError,
};
