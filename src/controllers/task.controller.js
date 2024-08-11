require('express-async-errors');

const httpStatus = require('http-status');

const TaskService = require('../services/task.service');

const taskService = new TaskService();

const tasks = async (req, res) => {
  const result = await taskService.tasks();
  const response = {
    success: true,
    result,
  };
  res.status(httpStatus.OK).json(response);
};

module.exports = {
  tasks,
};
