// src/services/notificationService.mts
import webPush from './webPushConfig.mts';
import admin from './firebaseAdmin.mts';
import { IUser } from '../interfaces/IUser.mts';

class NotificationService {
    async sendWebPushNotification(subscription: any, payload: any) {
        try {
            await webPush.sendNotification(subscription, payload);
        } catch (error) {
            console.error('Error sending web push notification:', error);
        }
    }

    async sendFirebasePushNotification(user: IUser, message: string) {
        const payload = {
            notification: {
                title: 'Medication Reminder',
                body: message,
            },
        };

        try {
            await admin.messaging().send({
                token: user.fcmToken!,
                ...payload,
            });
        } catch (error) {
            console.error('Error sending Firebase push notification:', error);
        }
    }
}

const notificationService = new NotificationService();
export default notificationService;
