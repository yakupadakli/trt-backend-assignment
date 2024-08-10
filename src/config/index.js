const DotenvConfig = require('./dotenv');
const R = require('ramda');

const config = () => {
  new DotenvConfig();

  const defaultConfig = require('./default');
  const environmentConfig = require(`./environments/${defaultConfig.env}`);

  return R.mergeDeepRight(defaultConfig, environmentConfig);
};

module.exports = config;
