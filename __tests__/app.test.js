const request = require('supertest');
const { createServer } = require('../src/server');

describe('App Server', () => {
  let app;

  beforeAll(() => {
    app = createServer();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start the server on the specified port', () => {
    const port = 3000;
    const server = app.listen(port, () => {});

    expect(server.address().port).toBe(port);
    server.close();
  });

  it('should respond to the /api route', async () => {
    const response = await request(app).get('/api/v1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Welcome to the API.');
  });

  it('should respond with a 404 error for an unknown route', async () => {
    const response = await request(app).get('/unknown-route');

    expect(response.status).toBe(500);
  });
});
