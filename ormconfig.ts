import { DataSourceOptions } from "typeorm";
import { User } from "./server/src/models/User.ts";
import { Medication } from "./server/src/models/Medication.ts";
import { Otp } from "./server/src/models/Otp.ts";
import config from "./server/src/config.ts";

const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: config.dbHost,
  port: config.dbPort,
  username: config.dbUsername,
  password: config.dbPassword,
  database: config.dbName,
  synchronize: config.nodeEnv !== "production",
  logging: ["warn", "error"],
  entities: [User, Medication, Otp],
  migrations: [],
  subscribers: [],
};

export default dataSourceOptions;
