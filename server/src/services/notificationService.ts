// src/services/notificationService.mts
import webPush from "./webPushConfig.ts";
import admin from "./firebaseAdmin.ts";
import { IUser } from "../interfaces/IUser.ts";

class NotificationService {
  async sendWebPushNotification(subscription: any, payload: any) {
    try {
      await webPush.sendNotification(subscription, payload);
    } catch (error) {
      console.error("Error sending web push notification:", error);
    }
  }

  async sendFirebasePushNotification(user: IUser, message: string) {
    const payload = {
      notification: {
        title: "Medication Reminder",
        body: message,
      },
    };

    try {
      await admin.messaging().send({
        token: user.fcmToken!,
        ...payload,
      });
    } catch (error) {
      console.error("Error sending Firebase push notification:", error);
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
