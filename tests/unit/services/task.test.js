const TaskService = require('../../../src/services/task.service');
const TaskDataAccess = require('../../../src/data-access/task.data-access');
const taskMock = require('../../mocks/task.mock');

jest.mock('../../../src/data-access/task.data-access');

describe('Task Service', () => {
  let taskService;
  let mockDataAccess;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    mockDataAccess = new TaskDataAccess();
    taskService = new TaskService();

    taskService.dataAccess = mockDataAccess;
  });

  describe('getUserTasks', () => {
    it('should return user tasks', async () => {
      const tasks = await taskMock.getTasks();

      mockDataAccess.getUserTasks.mockResolvedValue(tasks);

      const result = await taskService.getUserTasks('userId');

      expect(mockDataAccess.getUserTasks).toHaveBeenCalledTimes(1);
      expect(mockDataAccess.getUserTasks).toHaveBeenCalledWith(
        'userId',
        {},
        {},
      );
      expect(result).toEqual(tasks);
    });

    it('should return empty array if no tasks found', async () => {
      mockDataAccess.getUserTasks.mockResolvedValue([]);

      const result = await taskService.getUserTasks('userId');

      expect(mockDataAccess.getUserTasks).toHaveBeenCalledTimes(1);
      expect(mockDataAccess.getUserTasks).toHaveBeenCalledWith(
        'userId',
        {},
        {},
      );
      expect(result).toEqual([]);
    });

    it('should return user tasks with options and filter', async () => {
      const tasks = await taskMock.getTasks();
      const options = { limit: 10, page: 1 };
      const filter = { status: 'completed' };

      const mockResult = {
        docs: tasks,
        totalDocs: tasks.length,
        limit: 10,
        page: 1,
        totalPages: 1,
        pagingCounter: 1,
      };

      mockDataAccess.getUserTasks.mockResolvedValue(mockResult);

      const result = await taskService.getUserTasks('userId', options, filter);

      expect(mockDataAccess.getUserTasks).toHaveBeenCalledTimes(1);
      expect(mockDataAccess.getUserTasks).toHaveBeenCalledWith(
        'userId',
        options,
        filter,
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('getUserTask', () => {
    it('should return user task', async () => {
      const task = await taskMock.getTask();

      mockDataAccess.getUserTask.mockResolvedValue(task);

      const result = await taskService.getUserTask('userId', 'taskId');

      expect(mockDataAccess.getUserTask).toHaveBeenCalledTimes(1);
      expect(mockDataAccess.getUserTask).toHaveBeenCalledWith(
        'userId',
        'taskId',
      );
      expect(result).toEqual(task);
    });

    it('should throw TaskNotFoundError if task not found', async () => {
      mockDataAccess.getUserTask.mockResolvedValue(null);

      await expect(taskService.getUserTask('userId', 'taskId')).rejects.toThrow(
        'Task not found',
      );

      expect(mockDataAccess.getUserTask).toHaveBeenCalledTimes(1);
      expect(mockDataAccess.getUserTask).toHaveBeenCalledWith(
        'userId',
        'taskId',
      );
    });
  });

  describe('createUserTask', () => {
    it('should create user task', async () => {
      const task = await taskMock.getTask();
      const data = {
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate,
      };

      mockDataAccess.createTask.mockResolvedValue(task);

      const result = await taskService.createUserTask('userId', data);

      expect(mockDataAccess.createTask).toHaveBeenCalledTimes(1);
      expect(mockDataAccess.createTask).toHaveBeenCalledWith({
        user: 'userId',
        ...data,
      });
      expect(result).toEqual(task);
    });
  });

  describe('updateUserTask', () => {
    it('should update user task', async () => {
      const task = await taskMock.getTask();
      const data = {
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate,
      };

      mockDataAccess.updateTask.mockResolvedValue(task);

      const result = await taskService.updateUserTask('taskId', 'userId', data);

      expect(mockDataAccess.updateTask).toHaveBeenCalledTimes(1);
      expect(mockDataAccess.updateTask).toHaveBeenCalledWith(
        { _id: 'taskId', user: 'userId' },
        data,
      );
      expect(result).toEqual(task);
    });

    it('should throw TaskNotFoundError if task not found', async () => {
      const task = await taskMock.getTask();
      const data = {
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate,
      };

      mockDataAccess.updateTask.mockResolvedValue(null);

      await expect(
        taskService.updateUserTask('taskId', 'userId', data),
      ).rejects.toThrow('Task not found');

      expect(mockDataAccess.updateTask).toHaveBeenCalledTimes(1);
      expect(mockDataAccess.updateTask).toHaveBeenCalledWith(
        { _id: 'taskId', user: 'userId' },
        data,
      );
    });
  });

  describe('deleteUserTask', () => {
    it('should delete user task', async () => {
      mockDataAccess.deleteTask.mockResolvedValue({ deletedCount: 1 });

      const result = await taskService.deleteUserTask('taskId', 'userId');

      expect(mockDataAccess.deleteTask).toHaveBeenCalledTimes(1);
      expect(mockDataAccess.deleteTask).toHaveBeenCalledWith({
        _id: 'taskId',
        user: 'userId',
      });
      expect(result).toEqual({ deletedCount: 1 });
    });

    it('should throw TaskNotFoundError if task not found', async () => {
      mockDataAccess.deleteTask.mockResolvedValue({ deletedCount: 0 });

      await expect(
        taskService.deleteUserTask('taskId', 'userId'),
      ).rejects.toThrow('Task not found');

      expect(mockDataAccess.deleteTask).toHaveBeenCalledTimes(1);
      expect(mockDataAccess.deleteTask).toHaveBeenCalledWith({
        _id: 'taskId',
        user: 'userId',
      });
    });
  });
});
