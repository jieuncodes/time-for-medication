// tests/medicationRoutes.test.mts
import request from 'supertest';
import app from '@/app.mts';
import { AppDataSource } from '@/data-source.mts';
import { User } from '@/models/User.mts';
import { Medication } from '@/models/Medication.mts';

describe('Medication Routes', () => {
    let token = '';
    let medicationId = '';
    const testUsername = 'testuser';
    const testUser = {
        username: testUsername,
        password: 'Password123!',
        fcmToken: 'fakeFcmToken123'
    };
    const testMedication = {
        name: 'Aspirin',
        dosage: '100mg',
        frequency: 'Once a day',
        nextAlarm: new Date().toISOString()
    };

    beforeAll(async () => {
        await AppDataSource.initialize();
        await AppDataSource.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, {
                where: { username: testUsername },
                relations: ['medications']
            });

            if (user) {
                await transactionalEntityManager.remove(Medication, user.medications);
                await transactionalEntityManager.remove(User, user);
            }
        });
        await request(app).post('/api/register').send(testUser);
        const loginResponse = await request(app).post('/api/login').send(testUser);
        token = loginResponse.body.data.accessToken;

    });

    afterAll(async () => {
        await AppDataSource.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, {
                where: { username: testUsername },
                relations: ['medications']
            });

            if (user) {
                await transactionalEntityManager.remove(Medication, user.medications);
                await transactionalEntityManager.remove(User, user);
            }
        });
        await AppDataSource.destroy();
        console.log('medicationRoutes Test Database connection closed');
    });

    test('Add Medication', async () => {
        const postResponse = await request(app)
            .post('/api/medications')
            .set('Authorization', `Bearer ${token}`)
            .send(testMedication);
        expect(postResponse.status).toBe(200);
        medicationId = postResponse.body.data.id;
    });

    test('Update Medication1', async () => {
        const putResponse = await request(app)
            .put(`/api/medications/${medicationId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Ibuprofen', dosage: '100mg', frequency: 'Once a day', nextAlarm: new Date().toISOString() });
        expect(putResponse.status).toBe(200);
    });

    test('Update Medication2', async () => {
        const putResponse = await request(app)
            .put(`/api/medications/${medicationId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'lafa', dosage: '50mg', frequency: 'Twice a day', nextAlarm: new Date().toISOString() });
        expect(putResponse.status).toBe(200);
    });

    test('Delete Medication', async () => {
        const deleteResponse = await request(app)
            .delete(`/api/medications/${medicationId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(deleteResponse.status).toBe(204);
    });

});
