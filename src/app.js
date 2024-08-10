const { createServer } = require('./server');
const config = require('./config');
const { loadDependencies, unloadDependencies } = require('./loaders');

const app = createServer();
const port = process.env.PORT || 5000;

// Load the config
config();

const handleShutdown = async (signal) => {
  console.info(`Received ${signal}. Closing HTTP server...`);
  server.close(async (err) => {
    if (err) {
      console.error('Error while closing server:', err);
      process.exit(1);
    }

    console.info('HTTP server closed.');

    // Close other dependencies
    await unloadDependencies();
    process.exit(0);
  });
};

const server = app.listen(port, async () => {
  console.info(`App listening on port ${port}!`);
  // Connecting to db etc...
  await loadDependencies();
});

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

// Ensure server shuts down properly on unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);

  process.exit(1);
});

module.exports = { app };
