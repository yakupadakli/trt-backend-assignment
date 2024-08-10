const UserFactory = require('../factories/user.factory');

const users = Promise.all(UserFactory.buildList(10));
const user = UserFactory.build();

module.exports = {
  getUsers: jest.fn().mockResolvedValue(users),
  getUser: jest.fn().mockResolvedValue(user),
};
