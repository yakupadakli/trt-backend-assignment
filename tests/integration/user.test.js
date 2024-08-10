const request = require('supertest');
const { createServer } = require('../../src/server');

const UserFactory = require('../factories/user.factory');

const app = createServer();

describe('User Controller', () => {
  let user;
  let user1;

  beforeEach(async () => {
    [user, user1] = await Promise.all(
      UserFactory.buildList(2, { password: 'password' }, { saveDb: true }),
    );
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
});
