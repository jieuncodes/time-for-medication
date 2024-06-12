// src/data-source.mts
import { DataSource } from "typeorm";
import dataSourceOptions from "../ormconfig.ts";

export const AppDataSource = new DataSource(dataSourceOptions);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized successfully!");
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
