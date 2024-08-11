const BaseDataAccess = require('../core/core.data-access');
const Task = require('../models/task.model');

class TaskDataAccess extends BaseDataAccess {
  constructor() {
    super(Task);
  }

  async filterTasks(query = {}) {
    return this._getAll(query);
  }

  async getUserTasks(userId) {
    return this.filterTasks({ user: userId });
  }

  async getUserTask(taskId, userId) {
    return this._get({ _id: taskId, user: userId });
  }

  async createTask(taskData) {
    const { user, title, description, status, dueDate } = taskData;
    return this._create({ user, title, description, status, dueDate });
  }

  async updateTask(query, taskData) {
    const { user, title, description, status, dueDate } = taskData;
    const updateQuery = { $set: { user, title, description, status, dueDate } };
    return this._update(query, updateQuery);
  }

  async deleteTask(query) {
    return this._delete(query);
  }
}

module.exports = TaskDataAccess;
