const { Types } = require('mongoose');

const TaskFactory = require('../../factories/task.factory');
const TaskDataAccess = require('../../../src/data-access/task.data-access');
const UserFactory = require('../../factories/user.factory');
const { TASK_STATUSES } = require('../../../src/constants');

describe('TaskDataAccess', () => {
  let taskDataAccess;
  let task;
  let task1;

  beforeEach(async () => {
    jest.clearAllMocks();
    taskDataAccess = new TaskDataAccess();

    [task, task1] = await Promise.all(
      TaskFactory.buildList(
        2,
        { status: TASK_STATUSES.PENDING },
        { saveDb: true },
      ),
    );
    await TaskFactory.build(
      { user: task.user, status: TASK_STATUSES.IN_PROGRESS },
      { saveDb: true },
    );
  });

  describe('filterTasks', () => {
    it('should return a list of tasks', async () => {
      const result = await taskDataAccess.filterTasks({ user: task1.user });

      const taskTitles = result.docs.map((task) => task.title).sort();
      const expectedTaskTitles = [task1.title].sort();

      expect(result.docs).toHaveLength(1);
      expect(result.totalDocs).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.page).toBe(1);

      expect(taskTitles).toStrictEqual(expectedTaskTitles);
    });

    it('should return an empty list of tasks', async () => {
      const user = await UserFactory.build({}, { saveDb: true });
      const result = await taskDataAccess.filterTasks({ user: user._id });

      expect(result.docs).toHaveLength(0);
      expect(result.totalDocs).toBe(0);
      expect(result.limit).toBe(10);
      expect(result.page).toBe(1);
    });

    it('should return a list of tasks with options', async () => {
      const result = await taskDataAccess.filterTasks(
        { user: task.user },
        { limit: 1, page: 1 },
      );

      const taskTitles = result.docs.map((task) => task.title).sort();
      const expectedTaskTitles = [task.title].sort();

      expect(result.docs).toHaveLength(1);
      expect(result.totalDocs).toBe(2);
      expect(result.limit).toBe(1);
      expect(result.page).toBe(1);

      expect(taskTitles).toStrictEqual(expectedTaskTitles);
    });

    it('should return a list of tasks with default', async () => {
      const result = await taskDataAccess.filterTasks();

      expect(result.docs).toHaveLength(3);
      expect(result.totalDocs).toBe(3);
      expect(result.limit).toBe(10);
      expect(result.page).toBe(1);
    });
  });

  describe('getUserTasks', () => {
    it('should return a list of tasks with option and filter', async () => {
      const result = await taskDataAccess.getUserTasks(
        task.user,
        { limit: 10, page: 1 },
        { status: TASK_STATUSES.PENDING },
      );

      const taskTitles = result.docs.map((task) => task.title).sort();
      const expectedTaskTitles = [task.title].sort();

      expect(result.docs).toHaveLength(1);
      expect(result.totalDocs).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.page).toBe(1);

      expect(taskTitles).toStrictEqual(expectedTaskTitles);
    });

    it('should return tasks with different status', async () => {
      const result = await taskDataAccess.getUserTasks(
        task.user,
        { limit: 10, page: 1 },
        { status: TASK_STATUSES.IN_PROGRESS },
      );

      expect(result.docs).toHaveLength(1);
      expect(result.totalDocs).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.page).toBe(1);
    });

    it('should return a list of tasks with default', async () => {
      const result = await taskDataAccess.getUserTasks(task.user._id);

      expect(result.docs).toHaveLength(2);
      expect(result.totalDocs).toBe(2);
      expect(result.limit).toBe(10);
      expect(result.page).toBe(1);
    });
  });

  describe('getUserTask', () => {
    it('should return a task', async () => {
      const taskResult = await taskDataAccess.getUserTask(
        task._id.toString(),
        task.user.toString(),
      );

      expect(taskResult).not.toBeNull();
      expect(taskResult.title).toBe(task.title);
    });

    it('should return null if task not found', async () => {
      const user = await UserFactory.build({}, { saveDb: true });

      const taskResult = await taskDataAccess.getUserTask(
        task._id.toString(),
        user._id.toString(),
      );

      expect(taskResult).toBeNull();
    });

    it('should return null for invalid task ID', async () => {
      const invalidId = new Types.ObjectId();

      const taskResult = await taskDataAccess.getUserTask(
        invalidId.toString(),
        task.user.toString(),
      );

      expect(taskResult).toBeNull();
    });
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      const taskData = {
        title: 'New task',
        description: 'New task description',
        status: TASK_STATUSES.PENDING,
        dueDate: new Date(),
        user: task.user.toString(),
      };

      const taskResult = await taskDataAccess.createTask(taskData);

      expect(taskResult.title).toBe(taskData.title);
      expect(taskResult.status).toBe(taskData.status);
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const taskData = {
        title: 'Updated title',
      };

      const taskResult = await taskDataAccess.updateTask(
        { _id: task._id },
        taskData,
      );

      expect(taskResult).not.toBeNull();
      expect(taskResult.title).toBe('Updated title');
    });

    it('should return null if task not found', async () => {
      const taskData = TaskFactory.build({}, { saveDb: false });
      const nonExistTaskId = new Types.ObjectId();

      const taskResult = await taskDataAccess.updateTask(
        { _id: nonExistTaskId.toString() },
        taskData,
      );

      expect(taskResult).toBeNull();
    });

    it('should handle invalid update data', async () => {
      const invalidTaskData = {
        title: null,
      };

      const taskResult = await taskDataAccess.updateTask(
        { _id: task._id },
        invalidTaskData,
      );

      expect(taskResult).not.toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const newTask = await TaskFactory.build({}, { saveDb: true });
      const result = await taskDataAccess.deleteTask({
        _id: newTask._id.toString(),
      });

      expect(result.deletedCount).toBe(1);
    });

    it('should return null if task not found', async () => {
      const nonExistTaskId = new Types.ObjectId();
      const result = await taskDataAccess.deleteTask({
        _id: nonExistTaskId.toString(),
      });

      expect(result.deletedCount).toBe(0);
    });
  });
});
