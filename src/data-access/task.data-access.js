const BaseDataAccess = require('../core/core.data-access');
const Task = require('../models/task.model');

class TaskDataAccess extends BaseDataAccess {
  constructor() {
    super(Task);
  }

  async filterTasks(query = {}) {
    return this._getAll(query);
  }

  async getById(taskId) {
    return this._get({ _id: taskId });
  }
}

module.exports = TaskDataAccess;
