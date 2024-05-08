// tests/authRoutes.test.ts

import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/data-source';
import { User } from '../src/entities/User';
import { Medication } from '../src/entities/Medication';

describe('Authentication Routes', () => {
    beforeAll(async () => {
        await AppDataSource.initialize();
    });

    afterAll(async () => {
        await AppDataSource.destroy(); // Close the database connection
    });

    beforeEach(async () => {
        await AppDataSource.transaction(async transactionalEntityManager => {
            // Manually delete data respecting foreign keys
            await transactionalEntityManager.delete(Medication, {});
            await transactionalEntityManager.delete(User, {});
        });
    });

    afterEach(async () => {
        await AppDataSource.transaction(async transactionalEntityManager => {
            await transactionalEntityManager.query('ROLLBACK');
        });
    });

    describe('POST /api/register', () => {
        it('should register a new user and return 201 status', async () => {
            const response = await request(app)
                .post('/api/register')
                .send({
                    username: 'newuser',
                    password: 'Password123!'
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'User registered');
        });
    });

    describe('POST /api/login', () => {
        it('should authenticate user with correct credentials', async () => {
            // Register user first to ensure login can be tested
            await request(app)
                .post('/api/register')
                .send({
                    username: 'testuser',
                    password: 'Password123!'
                });

            const response = await request(app)
                .post('/api/login')
                .send({
                    username: 'testuser',
                    password: 'Password123!'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('accessToken');
        });

        it('should reject login with incorrect credentials', async () => {
            // Register user first to ensure there is a user to test incorrect credentials
            await request(app)
                .post('/api/register')
                .send({
                    username: 'testuser',
                    password: 'Password123!'
                });

            const response = await request(app)
                .post('/api/login')
                .send({
                    username: 'testuser',
                    password: 'WrongPassword!'
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid credentials');
        });
    });
});
