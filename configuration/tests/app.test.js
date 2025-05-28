const request = require('supertest');
const app = require('../app');

describe('Node.js Jenkins App', () => {
  
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Welcome to Node.js Jenkins CI/CD Demo');
      expect(res.body.version).toBe('1.0.0');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('OK');
      expect(res.body.timestamp).toBeDefined();
      expect(res.body.uptime).toBeDefined();
    });
  });

  describe('GET /status', () => {
    it('should return service status', async () => {
      const res = await request(app).get('/status');
      expect(res.statusCode).toBe(200);
      expect(res.body.service).toBe('nodejs-jenkins-app');
      expect(res.body.status).toBe('running');
      expect(res.body.version).toBe('1.0.0');
    });
  });

  describe('User API', () => {
    describe('GET /api/users', () => {
      it('should return all active users', async () => {
        const res = await request(app).get('/api/users');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.count).toBe(res.body.data.length);
      });
    });

    describe('GET /api/users/:id', () => {
      it('should return user by id', async () => {
        const res = await request(app).get('/api/users/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(1);
        expect(res.body.data.name).toBeDefined();
      });

      it('should return 404 for non-existent user', async () => {
        const res = await request(app).get('/api/users/999');
        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('User not found');
      });
    });

    describe('POST /api/users', () => {
      it('should create a new user', async () => {
        const newUser = {
          name: 'Test User',
          email: 'test@example.com'
        };

        const res = await request(app)
          .post('/api/users')
          .send(newUser);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe(newUser.name);
        expect(res.body.data.email).toBe(newUser.email);
        expect(res.body.data.id).toBeDefined();
      });

      it('should return 400 for missing required fields', async () => {
        const res = await request(app)
          .post('/api/users')
          .send({ name: 'Test User' }); // Missing email

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Name and email are required');
      });

      it('should return 409 for duplicate email', async () => {
        const duplicateUser = {
          name: 'Another User',
          email: 'john@example.com' // Existing email
        };

        const res = await request(app)
          .post('/api/users')
          .send(duplicateUser);

        expect(res.statusCode).toBe(409);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Email already exists');
      });
    });

    describe('PUT /api/users/:id', () => {
      it('should update user', async () => {
        const updatedData = {
          name: 'Updated Name'
        };

        const res = await request(app)
          .put('/api/users/1')
          .send(updatedData);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe(updatedData.name);
      });

      it('should return 404 for non-existent user', async () => {
        const res = await request(app)
          .put('/api/users/999')
          .send({ name: 'Updated Name' });

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
      });
    });

    describe('DELETE /api/users/:id', () => {
      it('should delete user (soft delete)', async () => {
        const res = await request(app).delete('/api/users/2');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('User deleted successfully');
      });

      it('should return 404 for non-existent user', async () => {
        const res = await request(app).delete('/api/users/999');
        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
      });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/unknown-route');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Route not found');
    });
  });
});