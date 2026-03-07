const request = require('supertest');
const bcrypt = require('bcryptjs');

// Mock external dependencies before importing server.js
jest.mock('postgres', () => {
    const sqlMock = jest.fn((strings, ...values) => {
        // Return empty arrays for SELECT queries by default
        return Promise.resolve([]);
    });
    return jest.fn(() => sqlMock);
});

jest.mock('./lib/crypto', () => ({
    encrypt: jest.fn(text => `enc:${text}`),
    decrypt: jest.fn(text => text.replace('enc:', ''))
}));

jest.mock('./lib/expiry', () => ({
    startExpiryJob: jest.fn()
}));

const sql = require('postgres')();
const app = require('./server');

describe('server.js API Routes', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/pricing', () => {
        it('should return pricing object', async () => {
            const res = await request(app).get('/api/pricing');
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('day', 15);
            expect(res.body).toHaveProperty('month', 299);
            expect(res.body).toHaveProperty('year', 2999);
        });
    });

    describe('GET /api/timeslots', () => {
        it('should return time slots array', async () => {
            const res = await request(app).get('/api/timeslots');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0]).toHaveProperty('startTime');
        });
    });

    describe('POST /api/register', () => {
        it('should require all fields', async () => {
            const res = await request(app)
                .post('/api/register')
                .send({ firstName: 'Test' });
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('All fields are required.');
        });

        it('should register a new user successfully', async () => {
            sql.mockResolvedValueOnce([]); // mock existing user check returning empty

            const res = await request(app)
                .post('/api/register')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    phone: '1234567890',
                    address: '123 Main St',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe('Account created successfully!');
        });

        it('should return 409 if user exists', async () => {
            sql.mockResolvedValueOnce([{ id: 1 }]); // mock existing user 

            const res = await request(app)
                .post('/api/register')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    phone: '1234567890',
                    address: '123 Main St',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(409);
            expect(res.body.error).toBe('An account with this email already exists.');
        });
    });

});
