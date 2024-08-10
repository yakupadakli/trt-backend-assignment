const { Factory } = require('rosie');
const { Types } = require('mongoose');
const faker = require('@faker-js/faker').faker;

const User = require('../../src/models/user.model');

const UserFactory = new Factory()
  .attrs({
    _id: () => new Types.ObjectId(),
    name: () => faker.lorem.sentence(),
    username: () => faker.internet.userName(),
    password: () => faker.internet.password(),
    email: () => faker.internet.email(),
    googleId: () =>
      faker.datatype.boolean() ? faker.string.alphanumeric(24) : null,
    createdAt: () => faker.date.recent(),
    updatedAt: () => faker.date.recent(),
  })
  .option('saveDb', false)
  .after(async (instance, options) => {
    instance.id = instance._id.toString();
    if (options.saveDb) {
      const user = await User.create(instance);
      instance.password = user.password;
      instance.createdAt = user.createdAt;
      instance.updatedAt = user.updatedAt;
    }
    return instance;
  });

module.exports = UserFactory;
