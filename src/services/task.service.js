const TaskDataAccess = require('../data-access/task.data-access');
const config = require('../config');

// const { TaskAlreadyExistsError } = require('../errors');

class TaskService {
  constructor() {
    this.dataAccess = new TaskDataAccess();
    this.config = config();
  }

  async tasks() {
    return await this.dataAccess.filterTasks();
  }
}

module.exports = TaskService;
