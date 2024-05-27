// src/app.ts 
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { AppDataSource } from './data-source';
import authRoutes from './controllers/authRoutes';
import medicationRoutes from './controllers/medicationRoutes';
import config from './config';
import { errorHandler } from './middlewares/errorHandler';


const app = express();

// Security Middleware

app.use(helmet());
app.use(cors({
    origin: config.allowedOrigins,
    optionsSuccessStatus: 200
}));

// Rate Limiting Middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15m
    max: 100, // limit each ip 100 request per windowMS
    message: "Too many requests, please try again later."
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
if (!['development', 'test'].includes(process.env.NODE_ENV!)) {
    app.use((req, res, next) => {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(301, `https://${req.hostname}${req.url}`);
        }
        next();
    });
}

// Global Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
    AppDataSource.initialize()
        .then(() => {
            console.log("Data Source has been initialized successfully!");
            const PORT = config.port ?? 3000;
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        })
        .catch((error) => {
            console.error("Error during Data Source initialization:", error);
        });
}

export default app;
