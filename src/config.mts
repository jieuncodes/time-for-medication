/// src/config.mts ///
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`Loading environment variables from .env.${process.env.NODE_ENV}`);
dotenv.config({ path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`) });

const requiredEnvVariables = [
  'DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_NAME', 'ACCESS_TOKEN_SECRET',
  'VAPID_PUBLIC_KEY', 'VAPID_PRIVATE_KEY', 'FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL','FIREBASE_PRIVATE_KEY', 'PORT', 'ALLOWED_ORIGINS',
  'POINTS_REGISTER', 'POINTS_LOGIN', 'POINTS_CREATE_MEDICATION', 'POINTS_UPDATE_MEDICATION', 'POINTS_DELETE_MEDICATION'
];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    console.error(`Environment variable ${variable} is missing`);
    process.exit(1);
  }
}

const port = parseInt(process.env.PORT!, 10);
if (isNaN(port)) {
  console.error(`Invalid PORT environment variable: ${process.env.PORT}`);
  process.exit(1);
}

const config = {
  dbHost: process.env.DB_HOST,
  dbPort: parseInt(process.env.DB_PORT!, 10),
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
  vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY,
  port,
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
  nodeEnv: process.env.NODE_ENV || 'development',
  pointsRegister: parseInt(process.env.POINTS_REGISTER!, 10),
  pointsLogin: parseInt(process.env.POINTS_LOGIN!, 10),
  pointsCreateMedication: parseInt(process.env.POINTS_CREATE_MEDICATION!, 10),
  pointsUpdateMedication: parseInt(process.env.POINTS_UPDATE_MEDICATION!, 10),
  pointsDeleteMedication: parseInt(process.env.POINTS_DELETE_MEDICATION!, 10)
};


export default config;
