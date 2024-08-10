const httpStatus = require('http-status');

const ApiError = require('./ApiError');
const {
  USER_EMAIL_OR_PASSWORD_INCORRECT,
  USER_ALREADY_EXISTS,
} = require('../constants/messages/error');
const { ERROR_CODES } = require('../constants/error');

class EmailOrPasswordIncorrectError extends ApiError {
  code = ERROR_CODES.USER_EMAIL_OR_PASSWORD_INCORRECT;

  constructor() {
    super(USER_EMAIL_OR_PASSWORD_INCORRECT, httpStatus.BAD_REQUEST);
  }
}

class UserAlreadyExistsError extends ApiError {
  code = ERROR_CODES.USER_ALREADY_EXISTS;

  constructor() {
    super(USER_ALREADY_EXISTS, httpStatus.BAD_REQUEST);
  }
}

module.exports = {
  EmailOrPasswordIncorrectError,
  UserAlreadyExistsError,
};
