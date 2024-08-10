require('express-async-errors');

const httpStatus = require('http-status');

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('email', email);
  console.log('password', password);
  const response = {
    success: true,
    result: [],
  };
  res.status(httpStatus.OK).json(response);
};

module.exports = {
  login,
};
