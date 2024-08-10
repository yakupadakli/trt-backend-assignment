const BaseDataAccess = require('../core/core.data-access');
const User = require('../models/user.model');

class UserDataAccess extends BaseDataAccess {
  constructor() {
    super(User);
  }

  async filterUsers(query = {}) {
    return this._getAll(query);
  }

  async findByEmail(email) {
    return this._get({ email });
  }

  async createUser({ name, surname, username, email, password }) {
    return this._create({ name, surname, username, email, password });
  }

  async getById(userId) {
    return this._get({ _id: userId });
  }
}

module.exports = UserDataAccess;
