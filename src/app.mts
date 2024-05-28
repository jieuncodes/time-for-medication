// src/app.mts

console.log("Server is starting...");

import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { AppDataSource } from './data-source.mts';
import authRoutes from './controllers/authRoutes.mts';
import medicationRoutes from './controllers/medicationRoutes.mts';
import config from './config.mts';
import { errorHandler } from './middlewares/errorHandler.mts';
import { sendErrorResponse } from './utils/response.mts';




const app = express();

// Security Middleware

app.use(helmet());
app.use(cors({
    origin: config.allowedOrigins,
    optionsSuccessStatus: 200
}));

// Rate Limiting Middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    handler: (req, res) => {
        sendErrorResponse(res, 429, "Too many requests, please try again later.");
    }
});
app.use(limiter);


app.use(cookieParser());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/medications', medicationRoutes);

// Simulate an error route for testing
app.get('/api/error', (req, res) => {
    throw new Error('Test error');
});

// Enforce HTTPS in non-development environments
if (!['development', 'test'].includes(config.nodeEnv)) {
    app.use((req, res, next) => {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(301, `https://${req.hostname}${req.url}`);
        }
        next();
    });
}

// Global Error Handler
app.use(errorHandler);

if (config.nodeEnv !== 'test') {
    AppDataSource.initialize()
        .then(() => {
            console.log("Data Source has been initialized successfully!");
            const PORT = config.port ?? 8000;
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        })
        .catch((error) => {
            console.error("Error during Data Source initialization:", error);
        });
}

export default app;
