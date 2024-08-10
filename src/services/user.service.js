const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { randomUUID } = require('crypto');

const UserDataAccess = require('../data-access/user.data-access');
const config = require('../config');

const {
  EmailOrPasswordIncorrectError,
  UserAlreadyExistsError,
} = require('../errors');

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

  async register(data) {
    const { username, email } = data;

    const query = { $or: [{ username }, { email }] };
    const user = await this.dataAccess.filterUsers(query);
    if (user.length > 0) {
      throw new UserAlreadyExistsError();
    }

    return this.dataAccess.createUser(data);
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

  async getGoogleUserToken(data) {
    const { email } = data;
    let user = await this.dataAccess.findByEmail(email);
    if (!user) {
      const password = await bcrypt.hash(randomUUID(), 10);
      await this.dataAccess.createUser({ ...data, password });
      user = await this.dataAccess.findByEmail(email);
    }

    const token = await this.generateToken(user);
    return { ...token };
  }
}

module.exports = UserService;
