const TaskDataAccess = require('../data-access/task.data-access');
const config = require('../config');

class TaskService {
  constructor() {
    this.dataAccess = new TaskDataAccess();
    this.config = config();
  }

  async getUserTasks(userId) {
    return await this.dataAccess.getUserTasks(userId);
  }

  async getUserTask(taskId, userId) {
    return await this.dataAccess.getUserTask(taskId, userId);
  }

  async createUserTask(userId, taskData) {
    return await this.dataAccess.createTask({ ...taskData, user: userId });
  }

  async updateUserTask(taskId, userId, taskData) {
    const query = { _id: taskId, user: userId };
    return await this.dataAccess.updateTask(query, taskData);
  }

  async deleteUserTask(taskId, userId) {
    const query = { _id: taskId, user: userId };
    return await this.dataAccess.deleteTask(query);
  }
}

module.exports = TaskService;
