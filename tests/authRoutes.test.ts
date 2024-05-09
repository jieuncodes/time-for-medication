// tests/authRoutes.test.ts

import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/data-source';
import { User } from '../src/entities/User';
import { Medication } from '../src/entities/Medication';

describe('Authentication Routes', () => {
    beforeAll(async () => {
        await AppDataSource.initialize();
        // delete 'testuser'
        await AppDataSource.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, {
                where: { username: 'testuser' },
                relations: ['medications'] 
            });
    
            if (user) {
                await transactionalEntityManager.remove(Medication, user.medications);
                await transactionalEntityManager.remove(User, user);
            }
        });
    });

    afterAll(async () => {
        // delete 'testuser'
        await AppDataSource.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, {
                where: { username: 'testuser' },
                relations: ['medications'] 
            });
    
            if (user) {
                await transactionalEntityManager.remove(Medication, user.medications);
                await transactionalEntityManager.remove(User, user);
            }
        });
        if (AppDataSource.isInitialized) {
            try {
                await AppDataSource.destroy();
                console.log('Data Source has been destroyed successfully!');
            } catch (error) {
                console.error("Error during Data Source destruction:", error);
            }
        }
    });

    beforeEach(async () => {

    });

    afterEach(async () => {
    });

    describe('POST /api/register', () => {
        test('should register a new user and return 201 status', async () => {
            const response = await request(app)
                .post('/api/register')
                .send({
                    username: 'testuser',
                    password: 'Password123!'
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'User registered');
        });
    });

    describe('POST /api/login', () => {
        test('should authenticate user with correct credentials', async () => {

            const response = await request(app)
                .post('/api/login')
                .send({
                    username: 'testuser',
                    password: 'Password123!'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('accessToken');
        });

        test('should reject login with incorrect credentials', async () => {
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
