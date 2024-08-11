require('express-async-errors');

const httpStatus = require('http-status');

const TaskService = require('../services/task.service');

const taskService = new TaskService();

const taskList = async (req, res) => {
  const {
    user: { userId },
  } = req;

  const results = await taskService.getUserTasks(userId);
  const response = {
    success: true,
    result: results || [],
  };
  res.status(httpStatus.OK).json(response);
};

const taskDetail = async (req, res) => {
  const { taskId } = req.params;
  const {
    user: { userId },
  } = req;

  const result = await taskService.getUserTask(taskId, userId);
  const response = {
    success: true,
    result: result || {},
  };
  res.status(httpStatus.OK).json(response);
};

const taskCreate = async (req, res) => {
  const {
    user: { userId },
  } = req;
  const taskData = req.body;

  const result = await taskService.createUserTask(userId, taskData);
  const response = {
    success: true,
    result: result || {},
  };
  res.status(httpStatus.CREATED).json(response);
};

const taskUpdate = async (req, res) => {
  const { taskId } = req.params;
  const {
    user: { userId },
  } = req;
  const taskData = req.body;

  const result = await taskService.updateUserTask(taskId, userId, taskData);
  const response = {
    success: true,
    result: result || {},
  };
  res.status(httpStatus.OK).json(response);
};

const taskDelete = async (req, res) => {
  const { taskId } = req.params;
  const {
    user: { userId },
  } = req;

  await taskService.deleteUserTask(taskId, userId);
  res.status(httpStatus.NO_CONTENT).send();
};

module.exports = {
  taskList,
  taskDetail,
  taskCreate,
  taskUpdate,
  taskDelete,
};
