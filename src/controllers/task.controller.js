require('express-async-errors');

const httpStatus = require('http-status');

const TaskService = require('../services/task.service');
const { buildTaskFilterQuery, buildSortQuery } = require('../utils/queries');

const taskService = new TaskService();

const taskList = async (req, res) => {
  const {
    user: { id: userId },
  } = req;
  const {
    page = 1,
    limit = 10,
    sortBy = 'dueDate',
    sortOrder = 'asc',
  } = req.query;
  const sort = buildSortQuery({ sortBy, sortOrder });
  const filter = buildTaskFilterQuery(req.query);

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
  };

  const result = await taskService.getUserTasks(userId, options, filter);
  const response = {
    success: true,
    totalCount: result.totalDocs,
    totalPages: result.totalPages,
    currentPage: result.page,
    limit: result.limit,
    result: result.docs || [],
  };
  res.status(httpStatus.OK).json(response);
};

const taskDetail = async (req, res) => {
  const { taskId } = req.params;
  const {
    user: { id: userId },
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
    user: { id: userId },
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
    user: { id: userId },
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
    user: { id: userId },
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
