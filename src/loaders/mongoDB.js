const mongoose = require('mongoose');

const config = require('../config');

class MongoDB {
  constructor() {
    this.mongoConfig = config().mongo;
    this.url = this.buildConnectionString();
  }

  buildConnectionString() {
    const { user, pass, url, dbName, dbOption, uriPrefix } = this.mongoConfig;

    return `${uriPrefix}://${user}:${pass}@${url}/${dbName}?${dbOption}`;
  }

  async connect() {
    try {
      console.info('Connecting to the database...');
      const connection = await mongoose.connect(this.url);
      console.info(
        `Successfully connected to "${connection.connections[0].name}"`,
      );
    } catch (err) {
      console.error('MongoDB connection error:', err);
      throw err; // Rethrow error to handle it in calling context
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.info('MongoDB disconnected successfully');
    } catch (err) {
      console.error('MongoDB disconnection error:', err);
    }
  }
}

module.exports = new MongoDB();
