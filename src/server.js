const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const createServer = () => {
  const app = express();
  app.use(cors());
  app.use(helmet());

  // sanitize request data
  app.use(mongoSanitize());

  // Check if there is any folder named logs to create .log file
  /* istanbul ignore next */
  if (!fs.existsSync(path.join(__dirname, './logs'))) {
    fs.mkdirSync(path.join(__dirname, './logs'));
  }

  // Get req.body to morgan
  morgan.token('body', (req) => JSON.stringify(req.body));

  // Create a write stream (in append mode)
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, './logs', 'request.log'),
    { flags: 'a' },
  );

  // Setup the logger
  app.use(
    morgan(
      ':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]',
    ),
  );

  app.use(
    morgan(
      ':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]',
      { stream: accessLogStream },
    ),
  );

  // Express json to get json payloads from body
  app.use(express.json());

  app.get('/api', (req, res) => {
    res.status(200).json({
      message: 'Welcome to the API.',
    });
  });

  //! Not found
  app.use((req, res, next) => {
    next(
      new Error(
        `There is no endpoint like ${req.path} for ${req.method} request.`,
      ),
    );
  });

  return app;
};

module.exports = { createServer };
