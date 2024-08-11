require('express-async-errors');

const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const mongoSanitize = require('express-mongo-sanitize');

const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const taskRouter = require('./routes/task.route');
const errorHandler = require('./middlewares/errorHandler');
const RateLimiter = require('./middlewares/rateLimiter');

const { errorLogHandler } = require('./logger/logHandler');
const { stringFormat } = require('./utils/helper');
const { NO_ENDPOINT } = require('./constants/messages/error');
const { NotFound } = require('./errors');

const config = require('./config')();

const createServer = () => {
  const app = express();
  const rateLimiter = new RateLimiter();

  app.use(
    session({
      secret: 'your_secret_key',
      resave: false,
      saveUninitialized: true,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(cors());
  app.use(helmet());

  // sanitize request data
  app.use(mongoSanitize());

  const {
    logger: { fileDir: logFileDir },
  } = config;
  const rootDirectory = path.resolve(__dirname, '../');

  /* istanbul ignore next */
  if (!fs.existsSync(path.join(rootDirectory, logFileDir))) {
    fs.mkdirSync(path.join(rootDirectory, logFileDir));
  }

  // Get req.body to morgan
  morgan.token('body', (req) => JSON.stringify(req.body));

  // Create a write stream (in append mode)
  const accessLogStream = fs.createWriteStream(
    path.join(rootDirectory, logFileDir, 'request.log'),
    { flags: 'a' },
  );

  // Setup the logger
  app.use(morgan('tiny'));
  app.use(morgan('combined', { stream: accessLogStream }));

  // Rate limiter
  app.use(rateLimiter.commonLimiter());

  // Express json to get json payloads from body
  app.use(express.json());

  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/tasks', taskRouter);

  app.get('/api/v1', rateLimiter.sensitiveLimiter(), (req, res) => {
    res.status(200).json({
      message: 'Welcome to the API.',
    });
  });

  //! Not found
  app.use((req, res, next) => {
    next(
      new NotFound(
        stringFormat(NO_ENDPOINT, { path: req.path, method: req.method }),
      ),
    );
  });

  // Error Logger
  app.use(errorLogHandler);

  // Error handler
  app.use(errorHandler);

  return app;
};

module.exports = { createServer };
