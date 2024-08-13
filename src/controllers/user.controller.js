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

const profile = async (req, res) => {
  const { user } = req;

  const response = {
    success: true,
    result: user,
  };
  res.status(httpStatus.OK).json(response);
};

const changePassword = async (req, res) => {
  const {
    user: { id: userId },
  } = req;
  const { oldPassword, newPassword } = req.body;

  const result = await userService.changePassword(
    userId,
    oldPassword,
    newPassword,
  );
  const response = {
    success: true,
    result,
  };
  res.status(httpStatus.OK).json(response);
};

module.exports = {
  login,
  register,
  profile,
  changePassword,
};
