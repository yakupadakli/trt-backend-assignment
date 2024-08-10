const request = require('supertest');

const { createServer } = require('../../src/server');

const app = createServer();

jest.mock('passport', () => ({
  authenticate: jest.fn().mockImplementation((strategy) => (req, res, next) => {
    if (strategy === 'google') {
      // Simulate success for the redirect route
      if (req.originalUrl === '/api/v1/auth/google/redirect') {
        req.user = {
          id: '123',
          name: { familyName: 'Doe', givenName: 'John' },
          emails: [{ value: 'example@example.com' }],
        };
        return next();
      }
      // Simulate redirection to Google for the initial route
      res.redirect('https://accounts.google.com/o/oauth2/v2/auth');
    } else {
      next();
    }
  }),
  initialize: jest.fn(() => (req, res, next) => next()),
  session: jest.fn(() => (req, res, next) => next()),
  use: jest.fn(),
  serializeUser: jest.fn(),
  deserializeUser: jest.fn(),
}));

jest.mock('passport-google-oauth20', () => ({
  Strategy: jest.fn().mockImplementation((options, verify) => {
    // Mocking the verify function
    verify('accessToken', 'refreshToken', 'profile', () => {});
  }),
}));

describe('Auth Controller', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/auth/google', () => {
    it('should redirect to Google for authentication', async () => {
      const response = await request(app).get('/api/v1/auth/google');

      expect(response.status).toBe(302); // 302 Redirect
      expect(response.headers.location).toMatch(
        /^https:\/\/accounts\.google\.com\/o\/oauth2\/v2\/auth/,
      );
    });
  });

  describe('GET /api/v1/auth/google/redirect', () => {
    it('should handle Google callback and return token', async () => {
      const response = await request(app).get('/api/v1/auth/google/redirect');

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);

      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toHaveProperty('token');
    });
  });
});
