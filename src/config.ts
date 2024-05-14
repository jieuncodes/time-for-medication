// src/config.ts
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`) });

const requiredEnvVariables = [
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_NAME',
  'ACCESS_TOKEN_SECRET',
  'VAPID_PUBLIC_KEY',
  'VAPID_PRIVATE_KEY'
];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    console.error(`Environment variable ${variable} is missing`);
    process.exit(1);
  }
}

const config = {
  dbHost: process.env.DB_HOST,
  dbPort: parseInt(process.env.DB_PORT!, 5432),
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
  vapidPrivateKey: process.env.VAPID_PRIVATE_KEY
};

export default config;
