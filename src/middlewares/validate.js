const { ValidationError } = require('../errors');
const { VALIDATION_ERROR } = require('../constants/messages/error');

const validate = (data, schema, req, next) => {
  const { value, error } = schema.validate(data);

  if (error) {
    const errorField = error.details?.[0]?.context?.key || '';
    const errorMessage = error.details?.[0]?.message || VALIDATION_ERROR;
    next(new ValidationError(errorMessage, errorField));
    return;
  }

  Object.assign(req, value);
  next();
};

const validateHeaders = (schema) => (req, _res, next) => {
  return validate(req.headers, schema, req, next);
};

const validateBody = (schema) => (req, _res, next) => {
  return validate(req.body, schema, req, next);
};

const validateQuery = (schema) => (req, _res, next) => {
  return validate(req.query, schema, req, next);
};

module.exports = {
  validateHeaders,
  validateBody,
  validateQuery,
};
