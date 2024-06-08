import { DataSourceOptions } from "typeorm";
import { User } from "./src/models/User.mts";
import { Medication } from "./src/models/Medication.mts";
import config from "./src/config.mts";

const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: config.dbHost,
  port: config.dbPort,
  username: config.dbUsername,
  password: config.dbPassword,
  database: config.dbName,
  synchronize: config.nodeEnv !== "production",
  logging: ["warn", "error"],
  entities: [User, Medication],
  migrations: [],
  subscribers: [],
};

export default dataSourceOptions;
