// tests/medicationRoutes.test.ts
import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/data-source';
import { User } from '../src/entities/User';
import { Medication } from '../src/entities/Medication';

describe('Medication Routes', () => {
    let token = '';
    let testUser = {
        username: 'testuser_med',
        password: 'Password123!'
    };
    let testMedication = {
        name: 'Aspirin',
        dosage: '100mg',
        frequency: 'Once a day',
        nextAlarm: new Date().toISOString()
    };

    beforeAll(async () => {
        await AppDataSource.initialize();
        await AppDataSource.transaction(async transactionalEntityManager => {
            await transactionalEntityManager.delete(Medication, {});
            await transactionalEntityManager.delete(User, {});
        });
        await request(app).post('/api/register').send(testUser);
        const loginResponse = await request(app).post('/api/login').send(testUser);
        token = loginResponse.body.accessToken;
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    beforeEach(async () => {
        await AppDataSource.getRepository(Medication).delete({});
    });

    test('POST /api/medications should create a new medication', async () => {
        const response = await request(app)
            .post('/api/medications')
            .set('Authorization', `Bearer ${token}`)
            .send(testMedication);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    test('GET /api/medications should retrieve all medications for the user', async () => {
        await request(app)
            .post('/api/medications')
            .set('Authorization', `Bearer ${token}`)
            .send(testMedication);

        const response = await request(app)
            .get('/api/medications')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
    });

    test('PUT /api/medications/:id should update a medication', async () => {
        const createResponse = await request(app)
            .post('/api/medications')
            .set('Authorization', `Bearer ${token}`)
            .send(testMedication);
        const medicationId = createResponse.body.id;

        const response = await request(app)
            .put(`/api/medications/${medicationId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Ibuprofen' });
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Ibuprofen');
    });

    test('DELETE /api/medications/:id should remove a medication', async () => {
        const createResponse = await request(app)
            .post('/api/medications')
            .set('Authorization', `Bearer ${token}`)
            .send(testMedication);
        const medicationId = createResponse.body.id;

        const response = await request(app)
            .delete(`/api/medications/${medicationId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(204);
    });
});
