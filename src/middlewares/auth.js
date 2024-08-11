const jwt = require('jsonwebtoken');

const UserService = require('../services/user.service');
const ApiError = require('../errors/ApiError');
const config = require('../config')();

const { parseAuthorizationHeader } = require('../utils/helpers');
const { AuthenticationError, AuthorizationError } = require('../errors');

const authenticate = async (req, res, next) => {
  const {
    jwt: { secret },
  } = config;
  const userService = new UserService();

  try {
    const token = parseAuthorizationHeader(req);
    if (!token) return next(new AuthorizationError());

    const decoded = jwt.verify(token, secret);
    const { userId } = decoded;

    const user = await userService.getUserById(userId);
    if (!user) return next(new AuthorizationError());

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Error authenticating user', error);

    if (!(error instanceof ApiError)) {
      return next(new AuthenticationError());
    }

    next(new AuthorizationError());
  }
};

module.exports = authenticate;
