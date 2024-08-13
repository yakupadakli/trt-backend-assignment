const request = require('supertest');
const { createServer } = require('../../src/server');

const UserFactory = require('../factories/user.factory');
const UserService = require('../../src/services/user.service');

const app = createServer();

describe('User Controller', () => {
  let user;
  let user1;
  let authToken;

  beforeEach(async () => {
    const userService = new UserService();

    [user, user1] = await Promise.all(
      UserFactory.buildList(2, { password: 'password' }, { saveDb: true }),
    );

    const token = await userService.generateToken(user);
    authToken = token.token;
  });

  describe('POST /api/v1/users/login', () => {
    it('should login a user', async () => {
      const response = await request(app).post('/api/v1/users/login').send({
        email: user.email,
        password: 'password',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toHaveProperty('token');
    });

    it('should return an error when password is incorrect', async () => {
      const response = await request(app).post('/api/v1/users/login').send({
        email: user1.email,
        password: 'password1',
      });

      expect(response.status).toBe(401);

      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);

      expect(response.body).toHaveProperty('code');
      expect(response.body.code).toBe(1100);
    });
  });

  describe('POST /api/v1/users/register', () => {
    it('should register a user', async () => {
      const generateUniqueEmail = () => `user${Math.random()}@example.com`;
      const generateUniqueUsername = () => `user${Math.random()}`;
      const email = generateUniqueEmail();
      const username = generateUniqueUsername();

      const response = await request(app).post('/api/v1/users/register').send({
        name: 'John',
        surname: 'Doe',
        username,
        email,
        password: 'password',
      });

      expect(response.status).toBe(201);

      expect(response.body).toHaveProperty('result');
    });

    it('should return an error when user already exists', async () => {
      const response = await request(app).post('/api/v1/users/register').send({
        name: 'John',
        surname: 'Doe',
        username: 'john_doe',
        email: user.email,
        password: 'password',
      });

      expect(response.status).toBe(400);

      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);

      expect(response.body).toHaveProperty('code');
      expect(response.body.code).toBe(1200);
    });
  });

  describe('GET /api/v1/users/profile', () => {
    it('should get user profile', async () => {
      const response = await request(app)
        .get('/api/v1/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('result');

      expect(response.body.result).toHaveProperty('email');
      expect(response.body.result.email).toBe(user.email);
    });

    it('should return an error when token is invalid', async () => {
      const response = await request(app)
        .get('/api/v1/users/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
    });
  });

  describe('PATCH /api/v1/users/change-password', () => {
    it('should change user password', async () => {
      const response = await request(app)
        .patch('/api/v1/users/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          oldPassword: 'password',
          newPassword: 'new-password',
          newPasswordConfirmation: 'new-password',
        });

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toHaveProperty('token');
    });

    it('should return an error when old password is incorrect', async () => {
      const response = await request(app)
        .patch('/api/v1/users/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          oldPassword: 'password1',
          newPassword: 'new-password',
          newPasswordConfirmation: 'new-password',
        });

      expect(response.status).toBe(401);

      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);

      expect(response.body).toHaveProperty('code');
      expect(response.body.code).toBe(1300);
    });

    it('should return an error when new password and confirmation do not match', async () => {
      const response = await request(app)
        .patch('/api/v1/users/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          oldPassword: 'password',
          newPassword: 'new-password',
          newPasswordConfirmation: 'new-password1',
        });

      expect(response.status).toBe(400);

      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);

      expect(response.body).toHaveProperty('code');
      expect(response.body.code).toBe(-3);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe(
        'New password and new password confirmation must match.',
      );

      expect(response.body).toHaveProperty('field');
      expect(response.body.field).toBe('newPasswordConfirmation');
    });

    it('should return an error when token is invalid', async () => {
      const response = await request(app)
        .patch('/api/v1/users/change-password')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          oldPassword: 'password',
          newPassword: 'new-password',
          newPasswordConfirmation: 'new-password',
        });

      expect(response.status).toBe(403);
    });
  });
});
