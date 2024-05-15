import { IUser } from '../src/interfaces/IUser';
import notificationService from '../src/services/notificationService';
import webPush from 'web-push';
import admin from 'firebase-admin';

jest.mock('web-push');
jest.mock('firebase-admin', () => {
    const originalModule = jest.requireActual('firebase-admin');
    return {
        ...originalModule,
        messaging: () => ({
            send: jest.fn().mockResolvedValue('mocked response')
        }),
    };
});

describe('Notification Service', () => {
    let mockUser: IUser;
    let sendMock: jest.SpyInstance;

    beforeAll(() => {
        mockUser = {
            id: 1,
            username: 'testuser',
            password: 'Password123!',
            points: 0,
            fcmToken: 'validFcmToken',
            hashPassword: jest.fn(),
            validatePassword: jest.fn(),
        };
        sendMock = jest.spyOn(admin.messaging(), 'send').mockResolvedValue('mocked response');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should send web push notification', async () => {
        const mockSubscription = { endpoint: 'https://example.com' };
        const mockPayload = JSON.stringify({ title: 'Test Notification' });

        await notificationService.sendWebPushNotification(mockSubscription, mockPayload);

        expect(webPush.sendNotification).toHaveBeenCalledWith(mockSubscription, mockPayload);
    });

    test('should send Firebase push notification', async () => {
        const mockMessage = 'This is a test message';

        await notificationService.sendFirebasePushNotification(mockUser, mockMessage);

        expect(sendMock).toHaveBeenCalledWith({
            token: mockUser.fcmToken,
            notification: {
                title: 'Medication Reminder',
                body: mockMessage,
            },
        });
    });
});
