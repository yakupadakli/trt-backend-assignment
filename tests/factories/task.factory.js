const { Factory } = require('rosie');
const { Types } = require('mongoose');
const { faker } = require('@faker-js/faker');
const Task = require('../../src/models/task.model');
const { TASK_STATUSES } = require('../../src/constants');

const TaskFactory = new Factory()
  .attrs({
    _id: () => new Types.ObjectId(),
    title: () => faker.lorem.sentence(),
    description: () => faker.lorem.sentence(),
    status: () => faker.helpers.arrayElement(Object.values(TASK_STATUSES)),
    dueDate: () => faker.date.future(),
    user: () => new Types.ObjectId(),
    createdAt: () => faker.date.recent(),
    updatedAt: () => faker.date.recent(),
  })
  .option('saveDb', false)
  .after(async (instance, options) => {
    instance.id = instance._id.toString();
    if (options.saveDb) {
      const task = await Task.create(instance);
      instance.createdAt = task.createdAt;
      instance.updatedAt = task.updatedAt;
    }
    return instance;
  });

module.exports = TaskFactory;
