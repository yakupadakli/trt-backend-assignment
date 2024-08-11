const logger = require('./index');

const errorLogHandler = (err, req, res, next) => {
  logger.error(`[${new Date().toISOString()}] Detail: ${err.stack}`);
  logger.error(`[${new Date().toISOString()}] Error: ${err.message}`);
  next(err);
};

module.exports = {
  errorLogHandler,
};
