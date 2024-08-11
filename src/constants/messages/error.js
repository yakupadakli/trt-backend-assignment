const INTERNAL_SERVER_ERROR = 'Internal Server Error...';
const NO_ENDPOINT = 'There is no endpoint like {path} for {method} request.';
const TOO_MANY_REQUESTS = 'Too many requests. Please try again later.';
const VALIDATION_ERROR = 'Validation error.';

// User
const USER_NOT_FOUND = 'User not found.';
const USER_EMAIL_OR_PASSWORD_INCORRECT = 'Email or password is incorrect.';
const USER_ALREADY_EXISTS = 'User already exists.';

// Task
const TASK_NOT_FOUND = 'Task not found.';
const TASK_ALREADY_EXISTS = 'Task already exists.';

module.exports = {
  INTERNAL_SERVER_ERROR,
  NO_ENDPOINT,
  TOO_MANY_REQUESTS,
  VALIDATION_ERROR,

  // User
  USER_NOT_FOUND,
  USER_EMAIL_OR_PASSWORD_INCORRECT,
  USER_ALREADY_EXISTS,

  // Task
  TASK_NOT_FOUND,
  TASK_ALREADY_EXISTS,
};
