// src/data-source.mts
import "reflect-metadata";
import { DataSource } from "typeorm";
import config from "./config.mts";
import { User } from "./models/User.mts";
import { Medication } from './models/Medication.mts';

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.dbHost,
  port: config.dbPort,
  username: config.dbUsername,
  password: config.dbPassword,
  database: config.dbName,
  synchronize: config.nodeEnv !== 'production',
  logging: ["warn", "error"],
  entities: [User, Medication],
  migrations: [],
  subscribers: [],
});
