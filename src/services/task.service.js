const TaskDataAccess = require('../data-access/task.data-access');
const { TaskNotFoundError } = require('../errors/task.errors');

class TaskService {
  constructor() {
    this.dataAccess = new TaskDataAccess();
  }

  async getUserTasks(userId, options = {}, filter = {}) {
    return await this.dataAccess.getUserTasks(userId, options, filter);
  }

  async getUserTask(taskId, userId) {
    const task = await this.dataAccess.getUserTask(taskId, userId);
    if (!task) throw new TaskNotFoundError();

    return task;
  }

  async createUserTask(userId, taskData) {
    return await this.dataAccess.createTask({ ...taskData, user: userId });
  }

  async updateUserTask(taskId, userId, taskData) {
    const query = { _id: taskId, user: userId };
    const task = await this.dataAccess.updateTask(query, taskData);
    if (!task) throw new TaskNotFoundError();

    return task;
  }

  async deleteUserTask(taskId, userId) {
    const query = { _id: taskId, user: userId };
    const result = await this.dataAccess.deleteTask(query);
    if (result.deletedCount === 0) throw new TaskNotFoundError();

    return result;
  }
}

module.exports = TaskService;
