const request = require('supertest');

const { createServer } = require('../../src/server');

const TaskFactory = require('../factories/task.factory');
const UserService = require('../../src/services/user.service');
const UserFactory = require('../factories/user.factory');
const { TASK_STATUSES } = require('../../src/constants');
const { getTomorrow } = require('../../src/utils/helpers');

const app = createServer();

describe('Task Controller', () => {
  let task;
  let task3;
  let authToken;

  beforeEach(async () => {
    const userService = new UserService();
    const user = await UserFactory.build({}, { saveDb: true });
    const user1 = await UserFactory.build({}, { saveDb: true });

    const token = await userService.generateToken(user);
    authToken = token.token;

    [task] = await Promise.all(
      TaskFactory.buildList(
        2,
        { user: user._id, status: TASK_STATUSES.PENDING },
        { saveDb: true },
      ),
    );
    await TaskFactory.build(
      { user: user._id, status: TASK_STATUSES.IN_PROGRESS },
      { saveDb: true },
    );

    task3 = await TaskFactory.build({ user: user1._id }, { saveDb: true });
  });

  describe('GET /api/v1/tasks', () => {
    it('should return user tasks', async () => {
      const response = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('totalCount');
      expect(response.body.totalCount).toBe(3);

      expect(response.body).toHaveProperty('totalPages');
      expect(response.body.totalPages).toBe(1);

      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toHaveLength(3);
    });

    it('should return user tasks with options', async () => {
      const response = await request(app)
        .get('/api/v1/tasks?limit=1&page=1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('totalCount');
      expect(response.body.totalCount).toBe(3);

      expect(response.body).toHaveProperty('totalPages');
      expect(response.body.totalPages).toBe(3);

      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toHaveLength(1);
    });

    it('should return user tasks with filter', async () => {
      const response = await request(app)
        .get(`/api/v1/tasks?status=${TASK_STATUSES.PENDING}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('totalCount');
      expect(response.body.totalCount).toBe(2);

      expect(response.body).toHaveProperty('totalPages');
      expect(response.body.totalPages).toBe(1);

      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toHaveLength(2);
    });

    it('should return user tasks with options and filter', async () => {
      const response = await request(app)
        .get(`/api/v1/tasks?status=${TASK_STATUSES.PENDING}&limit=1&page=1`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('totalCount');
      expect(response.body.totalCount).toBe(2);

      expect(response.body).toHaveProperty('totalPages');
      expect(response.body.totalPages).toBe(2);

      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toHaveLength(1);
    });

    it('should return user tasks with invalid options', async () => {
      const response = await request(app)
        .get('/api/v1/tasks?limit=invalid&page=invalid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
    });

    it('should return user tasks with invalid filter', async () => {
      const response = await request(app)
        .get('/api/v1/tasks?status=invalid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
    });

    it('should return user tasks with invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', 'Bearer invalid');

      expect(response.status).toBe(403);
    });

    it('should return user tasks with missing token', async () => {
      const response = await request(app).get('/api/v1/tasks');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/tasks/:taskId', () => {
    it('should return user task', async () => {
      const response = await request(app)
        .get(`/api/v1/tasks/${task._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('result');

      expect(response.body.result).toHaveProperty('_id');
      expect(response.body.result._id).toBe(task._id.toString());
    });

    it('should return user task with invalid task id', async () => {
      const response = await request(app)
        .get('/api/v1/tasks/invalid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should return user task with invalid token', async () => {
      const response = await request(app)
        .get(`/api/v1/tasks/${task._id}`)
        .set('Authorization', 'Bearer invalid');

      expect(response.status).toBe(403);
    });

    it('should return user task with missing token', async () => {
      const response = await request(app).get(`/api/v1/tasks/${task._id}`);

      expect(response.status).toBe(401);
    });

    it('should return 404 with another user', async () => {
      const response = await request(app)
        .get(`/api/v1/tasks/${task3._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/v1/tasks', () => {
    it('should create a task', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'New Task',
          description: 'New Task Description',
          status: TASK_STATUSES.PENDING,
          dueDate: getTomorrow(),
        });

      expect(response.status).toBe(201);

      expect(response.body).toHaveProperty('result');

      expect(response.body.result).toHaveProperty('_id');
      expect(response.body.result).toHaveProperty('title');
      expect(response.body.result.title).toBe('New Task');
    });

    it('should create a task with invalid body', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'New Task',
          description: 'New Task Description',
          status: TASK_STATUSES.PENDING,
        });

      expect(response.status).toBe(400);
    });

    it('should create a task with invalid token', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', 'Bearer invalid')
        .send({
          title: 'New Task',
          description: 'New Task Description',
          status: TASK_STATUSES.PENDING,
          dueDate: getTomorrow(),
        });

      expect(response.status).toBe(403);
    });

    it('should create a task with missing token', async () => {
      const response = await request(app).post('/api/v1/tasks').send({
        title: 'New Task',
        description: 'New Task Description',
        status: TASK_STATUSES.PENDING,
        dueDate: getTomorrow(),
      });

      expect(response.status).toBe(401);
    });

    it('should get 400 error with invalid due date', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'New Task',
          description: 'New Task Description',
          status: TASK_STATUSES.PENDING,
          dueDate: 'invalid',
        });

      expect(response.status).toBe(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('"dueDate" must be a valid date');
    });

    it('should get 400 error with invalid status', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'New Task',
          description: 'New Task Description',
          status: 'invalid',
          dueDate: getTomorrow(),
        });

      expect(response.status).toBe(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe(
        '"status" must be one of [Pending, In Progress, Completed]',
      );
    });

    it('should get 400 error with invalid title', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'New Task Description',
          status: TASK_STATUSES.PENDING,
          dueDate: getTomorrow(),
        });

      expect(response.status).toBe(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('"title" is required');
    });

    it('should get 400 error with invalid description', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'New Task',
          status: TASK_STATUSES.PENDING,
          dueDate: getTomorrow(),
        });

      expect(response.status).toBe(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('"description" is required');
    });

    it('should get 400 error with due date in the past', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'New Task',
          description: 'New Task Description',
          status: TASK_STATUSES.PENDING,
          dueDate: new Date(),
        });

      expect(response.status).toBe(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe(
        'The due date must be at least one day in the future.',
      );
    });
  });

  describe('PATCH /api/v1/tasks/:taskId', () => {
    it('should update a task', async () => {
      const response = await request(app)
        .patch(`/api/v1/tasks/${task._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Task',
        });

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('result');

      expect(response.body.result).toHaveProperty('_id');
      expect(response.body.result._id).toBe(task._id.toString());

      expect(response.body.result).toHaveProperty('title');
      expect(response.body.result.title).toBe('Updated Task');
    });

    it('should update a task with invalid body', async () => {
      const response = await request(app)
        .patch(`/api/v1/tasks/${task._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '',
        });

      expect(response.status).toBe(400);
    });

    it('should update a task with invalid token', async () => {
      const response = await request(app)
        .patch(`/api/v1/tasks/${task._id}`)
        .set('Authorization', 'Bearer invalid')
        .send({
          title: 'Updated Task',
        });

      expect(response.status).toBe(403);
    });

    it('should update a task with missing token', async () => {
      const response = await request(app)
        .patch(`/api/v1/tasks/${task._id}`)
        .send({
          title: 'Updated Task',
        });

      expect(response.status).toBe(401);
    });

    it('should update a task with invalid task id', async () => {
      const response = await request(app)
        .patch('/api/v1/tasks/invalid')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Task',
        });

      expect(response.status).toBe(404);
    });

    it('should update a task with another user', async () => {
      const response = await request(app)
        .patch(`/api/v1/tasks/${task3._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Task',
        });

      expect(response.status).toBe(404);
    });

    it('should update a task with invalid due date', async () => {
      const response = await request(app)
        .patch(`/api/v1/tasks/${task._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          dueDate: 'invalid',
        });

      expect(response.status).toBe(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('"dueDate" must be a valid date');
    });
  });

  describe('DELETE /api/v1/tasks/:taskId', () => {
    it('should delete a task', async () => {
      const response = await request(app)
        .delete(`/api/v1/tasks/${task._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);
    });

    it('should delete a task with invalid token', async () => {
      const response = await request(app)
        .delete(`/api/v1/tasks/${task._id}`)
        .set('Authorization', 'Bearer invalid');

      expect(response.status).toBe(403);
    });

    it('should delete a task with missing token', async () => {
      const response = await request(app).delete(`/api/v1/tasks/${task._id}`);

      expect(response.status).toBe(401);
    });

    it('should delete a task with invalid task id', async () => {
      const response = await request(app)
        .delete('/api/v1/tasks/invalid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should delete a task with another user', async () => {
      const response = await request(app)
        .delete(`/api/v1/tasks/${task3._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});
