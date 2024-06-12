// src/services/webPushConfig.mts
import webPush from "web-push";
import config from "../config.ts";

// VAPID 키 설정 (web-push)
webPush.setVapidDetails(
  "mailto:tedigom52@gmail.com",
  config.vapidPublicKey!,
  config.vapidPrivateKey!,
);

export default webPush;
