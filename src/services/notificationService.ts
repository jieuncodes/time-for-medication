// src/services/notificationService.ts
import webPush from 'web-push';
import admin from 'firebase-admin';
import { IUser } from '../interfaces/IUser';
import config from '../config'; 

// Firebase Admin SDK 초기화
import serviceAccount from '../configs/firebaseServiceAccountKey.json';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
} else {
    admin.app();
}

// VAPID 키 설정 (web-push)
const vapidPublicKey = config.vapidPublicKey;
const vapidPrivateKey = config.vapidPrivateKey;

if (!vapidPublicKey || !vapidPrivateKey) {
    console.error('VAPID keys are missing');
    throw new Error('VAPID keys are missing');
}

webPush.setVapidDetails(
    'mailto:tedigom52@gmail.com',
    vapidPublicKey,
    vapidPrivateKey
);

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

        // Firebase Cloud Messaging을 통해 푸시 알림 전송
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
