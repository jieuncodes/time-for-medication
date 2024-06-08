// src/services/firebaseAdmin.mts
import admin from "firebase-admin";
import config from "../config.mts";

// Firebase Admin SDK 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.firebaseProjectId,
      clientEmail: config.firebaseClientEmail,
      privateKey: config.firebasePrivateKey?.replace(/\\n/g, "\n"),
    }),
  });
}

export default admin;
