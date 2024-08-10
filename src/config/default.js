const pkg = require('../../package.json');

const name = process.env.NAME || pkg.name;
const version = process.env.VERSION || pkg.version;
const env = process.env.NODE_ENV || 'development';

module.exports = {
  name,
  version,
  env,
  port: process.env.PORT || 5000,
  mongo: {
    user: process.env.DB_USER || 'admin',
    pass: process.env.DB_PASS || 'password',
    url: process.env.DB_URL || 'localhost',
    dbName: process.env.DB_NAME || 'test',
    dbOption: process.env.DB_OPTION || 'retryWrites=true&w=majority',
    uriPrefix: process.env.MONGO_URI_PREFIX || 'mongodb',
  },
  jwt: {
    secret: process.env.TOKEN_SECRET || 'secret',
    expiresIn: process.env.TOKEN_EXPIRES_IN || '1d',
  },
  authTokenType: 'Bearer',
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || 'client_id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'client_secret',
    redirectUri:
      process.env.GOOGLE_REDIRECT_URI || '/api/v1/auth/google/redirect',
  },
};
