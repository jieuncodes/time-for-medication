// src/services/notificationService.mts
import webPush from 'web-push';
import admin from 'firebase-admin';
import { IUser } from '../interfaces/IUser.mts';
import config from '../config.mts';



// Firebase Admin SDK 초기화
if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebaseProjectId,
        clientEmail: config.firebaseClientEmail,
        privateKey: config.firebasePrivateKey?.replace(/\\n/g, '\n')
      })
    });
  } else {
    admin.app();
  }



// VAPID 키 설정 (web-push)
webPush.setVapidDetails(
    'mailto:tedigom52@gmail.com',
    config.vapidPublicKey!,
    config.vapidPrivateKey!
);

class NotificationService {
    async sendWebPushNotification(subscription: any, payload: any) {
        try {
            console.log('Subscription keys:', subscription.keys);
            console.log('p256dh length:', subscription.keys.p256dh.length);
            console.log('auth length:', subscription.keys.auth.length);
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
