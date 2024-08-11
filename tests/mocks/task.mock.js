const TaskFactory = require('../factories/task.factory');

const tasks = Promise.all(TaskFactory.buildList(10));
const task = TaskFactory.build();

module.exports = {
  getTasks: jest.fn().mockResolvedValue(tasks),
  getTask: jest.fn().mockResolvedValue(task),
};
