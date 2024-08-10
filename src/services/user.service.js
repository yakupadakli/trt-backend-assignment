const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserDataAccess = require('../data-access/user.data-access');
const config = require('../config');

const { EmailOrPasswordIncorrectError } = require('../errors');

const { TOKEN_TYPES } = require('../constants');

class UserService {
  constructor() {
    this.dataAccess = new UserDataAccess();
    this.config = config();
  }

  async login(email, password) {
    const user = await this.dataAccess.findByEmail(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = await this.generateToken(user);
        return { ...token };
      }
    }

    throw new EmailOrPasswordIncorrectError();
  }

  async generateToken(user, type = TOKEN_TYPES.ACCESS) {
    const {
      authTokenType,
      jwt: { secret, expiresIn },
    } = this.config;
    const token = jwt.sign(
      { userId: user._id, email: user.email, type },
      secret,
      { expiresIn },
    );

    return {
      token,
      expiresIn,
      tokenType: authTokenType,
    };
  }

  async getUserById(userId) {
    return this.dataAccess.getById(userId);
  }
}

module.exports = UserService;
