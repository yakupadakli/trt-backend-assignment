const mongoDB = require('./mongoDB');

const loadDependencies = async () => {
  // Database connection
  await mongoDB.connect();

  // Other loaders...
};

const unloadDependencies = async () => {
  // Database disconnection
  await mongoDB.disconnect();

  // Other unloaders...
};

module.exports = {
  loadDependencies,
  unloadDependencies,
};
