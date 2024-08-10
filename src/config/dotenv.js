const dotenv = require('dotenv');

class Config {
  constructor() {
    this.loadConfig();
  }

  loadConfig() {
    dotenv.config();
  }
}

module.exports = Config;
