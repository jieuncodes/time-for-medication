// src/app.ts 
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppDataSource } from './data-source';
import authRoutes from './controllers/authRoutes';
import medicationRoutes from './controllers/medicationRoutes';

const app = express();

// Apply helmet to set security-related HTTP headers
app.use(helmet());

// Parse Cookie header and populate req.cookies
app.use(cookieParser());

app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/medications', medicationRoutes);

// Enforce HTTPS in non-development environments
app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV !== 'development') {
        return res.redirect(301, `https://${req.hostname}${req.url}`);
    }
    next();
});

if (process.env.NODE_ENV != 'test') {
    AppDataSource.initialize()
        .then(() => {
            console.log("Data Source has been initialized successfully!");
            const PORT = process.env.PORT ?? 3000;
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        })
        .catch((error) => {
            console.error("Error during Data Source initialization:", error);
        });
}

export default app;
