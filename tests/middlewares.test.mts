/// tests/middlewares.test.mts ///

import request from 'supertest';
import app from '@/app.mts';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppDataSource } from '@/data-source.mts';
import { User } from '@/models/User.mts';
import { Medication } from '@/models/Medication.mts';
import { POINTS_CONFIG } from '@/middlewares/pointsMiddleware.mts';
import config from '../src/config.mts';

describe('Middleware Tests', () => {
    let token: string;
    const testUser = {
        username: 'middlewaretestuser',
        password: 'Password123!',
        fcmToken: 'fakeFcmToken123'
    };

    const testUser2 = {
        username: 'middlewaretestuser2',
        password: 'Password123!',
        fcmToken: 'fakeFcmToken123'
    };

    beforeAll(async () => {
        await AppDataSource.initialize();
        await request(app).post('/api/register').send(testUser);
        const loginResponse = await request(app).post('/api/login').send(testUser);
        token = loginResponse.body.data.accessToken;
    });

    afterAll(async () => {
        await AppDataSource.transaction(async transactionalEntityManager => {
            const users = await transactionalEntityManager.find(User, {
                where: [{ username: testUser.username }, { username: testUser2.username }],
                relations: ['medications']
            });

            for (const user of users) {
                await transactionalEntityManager.remove(User, user);
            }
        });
        await AppDataSource.destroy();
    });

    describe('authenticateToken Middleware', () => {
        test('should authenticate valid token', async () => {
            const response = await request(app)
                .get('/api/medications')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).not.toBe(401);
            expect(response.status).not.toBe(403);
        });

        test('should fail with invalid token', async () => {
            const response = await request(app)
                .get('/api/medications')
                .set('Authorization', `Bearer invalidtoken`);
            expect(response.status).toBe(403);
        });

        test('should fail with no token', async () => {
            const response = await request(app)
                .get('/api/medications');
            expect(response.status).toBe(401);
        });
    });

    describe('updatePoints Middleware', () => {
        test('should update points on successful registration', async () => {
            const response = await request(app)
                .post('/api/register')
                .send(testUser2);
            console.log('Registration response:', response.body);
            expect(response.status).toBe(200);

            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ username: testUser2.username });
            expect(user).not.toBeNull();
            expect(user!.points).toBe(POINTS_CONFIG.REGISTER);
        });

        test('should update points on successful login', async () => {
            const userRepository = AppDataSource.getRepository(User);
            const userBeforeLogin = await userRepository.findOneBy({ username: testUser.username });
            console.log('Points before login:', userBeforeLogin?.points);

            const response = await request(app)
                .post('/api/login')
                .send(testUser);
            expect(response.status).toBe(200);

            const userAfterLogin = await userRepository.findOneBy({ username: testUser.username });
            console.log('Points after login:', userAfterLogin?.points);

            expect(userAfterLogin).not.toBeNull();
            expect(userAfterLogin!.points).toBe(POINTS_CONFIG.REGISTER + 2 * POINTS_CONFIG.LOGIN);
        });
    });
});

describe('Middleware - JWT Expiration', () => {
    let expiredToken = '';
    const testUser = {
        username: 'expirationtestuser',
        password: 'Password123!',
        fcmToken: 'fakeFcmToken123'
    };

    beforeAll(async () => {
        await AppDataSource.initialize();
        await request(app).post('/api/register').send(testUser);
        const loginResponse = await request(app).post('/api/login').send(testUser);
        const tokenPayload = jwt.verify(loginResponse.body.data.accessToken, config.accessTokenSecret!) as JwtPayload;
        tokenPayload.exp = Math.floor(Date.now() / 1000) - 30; // Set expiration to 30 seconds in the past
        expiredToken = jwt.sign(tokenPayload, config.accessTokenSecret!);
    });

    afterAll(async () => {
        await AppDataSource.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, {
                where: { username: testUser.username },
                relations: ['medications']
            });

            if (user) {
                await transactionalEntityManager.remove(Medication, user.medications);
                await transactionalEntityManager.remove(User, user);
            }
        });
        await AppDataSource.destroy();
    });

    test('Should reject expired token', async () => {
        const response = await request(app)
            .get('/api/medications')
            .set('Authorization', `Bearer ${expiredToken}`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Token has expired, please log in again.');
    });
});
