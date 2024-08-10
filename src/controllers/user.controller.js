require('express-async-errors');

const httpStatus = require('http-status');

const UserService = require('../services/user.service');

const userService = new UserService();

const login = async (req, res) => {
  const { email, password } = req.body;

  const result = await userService.login(email, password);
  const response = {
    success: true,
    result,
  };
  res.status(httpStatus.OK).json(response);
};

const register = async (req, res) => {
  const { name, surname, username, email, password } = req.body;

  const result = await userService.register({
    name,
    surname,
    username,
    email,
    password,
  });
  const response = {
    success: true,
    result,
  };
  res.status(httpStatus.CREATED).json(response);
};

module.exports = {
  login,
  register,
};
