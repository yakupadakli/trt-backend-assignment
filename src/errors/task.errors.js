const httpStatus = require('http-status');

const ApiError = require('./ApiError');
const { TASK_ALREADY_EXISTS } = require('../constants/messages/error');
const { ERROR_CODES } = require('../constants/error');

class TaskAlreadyExistsError extends ApiError {
  code = ERROR_CODES.TASK_ALREADY_EXISTS;

  constructor() {
    super(TASK_ALREADY_EXISTS, httpStatus.BAD_REQUEST);
  }
}

module.exports = {
  TaskAlreadyExistsError,
};
