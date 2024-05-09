// src/data-source.ts //

import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Medication } from './entities/Medication';

// Environment variable validation
if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_USERNAME || !process.env.DB_PASSWORD || !process.env.DB_NAME || !process.env.ACCESS_TOKEN_SECRET) {
    console.error("One or more environment variables are undefined. Check your .env file.");
    process.exit(1);
}

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME, 
    synchronize: process.env.NODE_ENV !== 'production', // synchronize the database state with the models only in non-production modes
    logging: process.env.NODE_ENV !== 'production', // enable logging in non-production environments
    entities: [User, Medication],
    migrations: [],
    subscribers: [],
});

