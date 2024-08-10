require('express-async-errors');

const httpStatus = require('http-status');

const UserService = require('../services/user.service');

const userService = new UserService();

const getGoogleUserToken = async (req, res) => {
  const {
    id: googleId,
    name: { familyName: surname, givenName: name },
    emails,
  } = req.user;
  const email = emails?.[0]?.value;

  const result = await userService.getGoogleUserToken({
    username: googleId,
    googleId,
    name,
    surname,
    email,
  });

  const response = {
    success: true,
    result,
  };
  res.status(httpStatus.OK).json(response);
};

module.exports = {
  getGoogleUserToken,
};
