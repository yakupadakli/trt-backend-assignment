const INTERNAL_SERVER_ERROR = 'Internal Server Error...';
const NO_ENDPOINT = 'There is no endpoint like {path} for {method} request.';
const TOO_MANY_REQUESTS = 'Too many requests. Please try again later.';
const VALIDATION_ERROR = 'Validation error.';

// User
const USER_NOT_FOUND = 'User not found.';
const USER_EMAIL_OR_PASSWORD_INCORRECT = 'Email or password is incorrect.';
const USER_ALREADY_EXISTS = 'User already exists.';
const USER_PASSWORDS_MUST_MATCH =
  'New password and new password confirmation must match.';
const CURRENT_PASSWORD_INCORRECT =
  'Password does not match with the current password.';

// Task
const TASK_NOT_FOUND = 'Task not found.';
const TASK_ALREADY_EXISTS = 'Task already exists.';
const TASK_DUE_DATE_ONE_DAY_IN_FUTURE =
  'The due date must be at least one day in the future.';

// Auth
const NOT_AUTHORIZED = 'Not authorized.';
const AUTHENTICATION_ERROR = 'Authentication error.';

module.exports = {
  INTERNAL_SERVER_ERROR,
  NO_ENDPOINT,
  TOO_MANY_REQUESTS,
  VALIDATION_ERROR,

  // User
  USER_NOT_FOUND,
  USER_EMAIL_OR_PASSWORD_INCORRECT,
  USER_ALREADY_EXISTS,
  USER_PASSWORDS_MUST_MATCH,
  CURRENT_PASSWORD_INCORRECT,

  // Task
  TASK_NOT_FOUND,
  TASK_ALREADY_EXISTS,
  TASK_DUE_DATE_ONE_DAY_IN_FUTURE,

  // Auth
  NOT_AUTHORIZED,
  AUTHENTICATION_ERROR,
};
