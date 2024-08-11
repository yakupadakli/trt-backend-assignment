const winston = require('winston');
const path = require('path');

const config = require('../config')();

const {
  logger: { level: logLevel, fileDir },
} = config;
const rootDirectory = path.resolve(__dirname, '../../');
const logDirectory = path.join(rootDirectory, fileDir);

const debugFilter = winston.format((info) => {
  // Return the info object if the level is not 'error', otherwise return false
  return info.level === 'error' ? false : info;
});

const logger = winston.createLogger({
  level: logLevel,
  // format: winston.format.combine(
  //   winston.format.timestamp({
  //     format: 'YYYY-MM-DD HH:mm:ss',
  //   }),
  //   winston.format.printf(({ timestamp, level, message }) => {
  //     return `${timestamp} ${level.toUpperCase()}: ${message}`;
  //   })
  // ),
  transports: [
    new winston.transports.Console({
      level: logLevel,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.File({
      filename: path.join(logDirectory, 'debug.log'),
      level: 'debug',
      handleExceptions: true,
      format: winston.format.combine(debugFilter(), winston.format.simple()),
    }),

    // Error level logs
    new winston.transports.File({
      filename: path.join(logDirectory, 'error.log'),
      level: 'error',
      handleExceptions: true,
    }),
  ],
});

module.exports = logger;
