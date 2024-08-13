const Joi = require('joi');
const { USER_PASSWORDS_MUST_MATCH } = require('../constants/messages/error');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const registerSchema = Joi.object({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
  newPasswordConfirmation: Joi.string()
    .required()
    .valid(Joi.ref('newPassword'))
    .messages({
      'any.only': USER_PASSWORDS_MUST_MATCH,
    }),
});

module.exports = {
  loginSchema,
  registerSchema,
  changePasswordSchema,
};
