// src/app.ts 
import express from 'express';
import { AppDataSource } from './data-source';
import authRoutes from './routes/authRoutes';
import medicationRoutes from './routes/medicationRoutes';

const app = express();

app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/medications', medicationRoutes);

if (process.env.NODE_ENV != 'test') {
    AppDataSource.initialize()
        .then(() => {
            console.log("Data Source has been initialized successfully!");
            const PORT = process.env.PORT ?? 5432;
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        })
        .catch((error) => {
            console.error("Error during Data Source initialization:", error);
        });

    AppDataSource.destroy()
        .then(() => {
            console.log("Data Source has been destroyed successfully!");
        })
        .catch((error) => {
            console.error("Error during Data Source destruction:", error);
        });

}


export default app;
