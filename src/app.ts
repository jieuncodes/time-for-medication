// src/app.ts //
import 'dotenv/config';
import express from 'express';
import { AppDataSource } from './data-source';
import authRoutes from './routes/authRoutes';
import medicationRoutes from './routes/medicationRoutes';

const app = express();

app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/medications', medicationRoutes);

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized successfully!");
    })
    .catch((error) => {
        console.error("Error during Data Source initialization:", error);
    });

export default app;
