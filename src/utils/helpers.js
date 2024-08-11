const logger = require('../logger');

const config = require('../config')();

const stringFormat = (str, data) =>
  str.replace(/{(\w+)}/g, (match, p1) => data[p1] || match);

const parseAuthorizationHeader = (req) => {
  const { authTokenType } = config;
  const authHeader = req.header('Authorization') || '';

  let tokenType = '';
  let token = '';

  try {
    [tokenType, token] = authHeader.split(' ');
  } catch (error) {
    logger.error('Error parsing parseAuthorizationHeader', error);
    token = '';
    tokenType = '';
  }

  return tokenType === authTokenType ? token : '';
};

module.exports = {
  stringFormat,
  parseAuthorizationHeader,
};
