// tests/medicationRoutes.test.ts
import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/data-source';
import { User } from '../src/entities/User';
import { Medication } from '../src/entities/Medication';

describe('Medication Routes', () => {
    let token = '';
    let medicationId = '';
    const testUsername = 'testuser';
    const testUser = {
        username: testUsername,
        password: 'Password123!'
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
        token = loginResponse.body.accessToken;
        
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
        // POST a new medication
        const postResponse = await request(app)
            .post('/api/medications')
            .set('Authorization', `Bearer ${token}`)
            .send(testMedication);
        expect(postResponse.status).toBe(201);
        medicationId = postResponse.body.id;
    });

    test('Update Medication', async () => {
        // PUT to update the medication
        const putResponse = await request(app)
            .put(`/api/medications/${medicationId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Ibuprofen' });
        expect(putResponse.status).toBe(200);

    });

    
    test('Delete Medication', async () => {
        // DELETE the medication //오류: 이 코드를 주석처리하면 100포인트, 주석처리하지않으면 110포인트가 추가됨
        const deleteResponse = await request(app)
            .delete(`/api/medications/${medicationId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(deleteResponse.status).toBe(204);
    });

});
