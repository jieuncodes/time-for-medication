// src/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import config from "./config";
import { User } from "./models/User";
import { Medication } from './models/Medication';

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.dbHost,
  port: config.dbPort,
  username: config.dbUsername,
  password: config.dbPassword,
  database: config.dbName,
  synchronize: config.nodeEnv !== 'production',
  logging: config.nodeEnv !== 'production',
  entities: [User, Medication],
  migrations: [],
  subscribers: [],
});
