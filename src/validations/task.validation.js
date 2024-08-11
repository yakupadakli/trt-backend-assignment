const Joi = require('joi');
const { TASK_STATUSES } = require('../constants');
const {
  TASK_DUE_DATE_ONE_DAY_IN_FUTURE,
} = require('../constants/messages/error');
const { getTomorrow } = require('../utils/helpers');

// const dateOneDayFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);

const tomorrow = getTomorrow();

const taskCreateSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  dueDate: Joi.date().required().greater(tomorrow).messages({
    'date.greater': TASK_DUE_DATE_ONE_DAY_IN_FUTURE,
  }),
  status: Joi.string().valid(...Object.values(TASK_STATUSES)),
});

const taskUpdateSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  dueDate: Joi.date(),
  status: Joi.string().valid(...Object.values(TASK_STATUSES)),
});

const taskFilterSchema = Joi.object({
  status: Joi.string().valid(...Object.values(TASK_STATUSES)),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
});

module.exports = {
  taskCreateSchema,
  taskUpdateSchema,
  taskFilterSchema,
};
