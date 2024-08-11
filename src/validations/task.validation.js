const Joi = require('joi');

const taskCreateSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
});

const taskUpdateSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
});

module.exports = {
  taskCreateSchema,
  taskUpdateSchema,
};
