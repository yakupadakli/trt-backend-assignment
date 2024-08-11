const Joi = require('joi');

const paginateQuerySchema = Joi.object({
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100),
  sortBy: Joi.string(),
  sortOrder: Joi.string().valid('asc', 'desc'),
});

module.exports = {
  paginateQuerySchema,
};
