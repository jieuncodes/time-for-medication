// src/app.mts

import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { AppDataSource } from "./data-source.ts";
import authRoutes from "./controllers/authRoutes.ts";
import medicationRoutes from "./controllers/medicationRoutes.ts";
import subscriptionRoutes from "./controllers/subscriptionRoutes.ts";
import config from "./config.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";
import { sendErrorResponse } from "./utils/response.ts";

const app = express();

// Security Middleware

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"], //need to edit
      styleSrc: ["'self'", "https://fonts.googleapis.com"], //need to edit
      imgSrc: ["'self'", "https://images.unsplash.com"], //need to edit
      frameSrc: ["'self'", "https://www.youtube.com"], //need to edit
    },
    reportOnly: config.nodeEnv !== "production", // Report-only mode in non-production environments
  }),
);

app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  }),
);

app.use(helmet.hidePoweredBy());
app.use(helmet.frameguard({ action: "deny" }));
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.referrerPolicy({ policy: "no-referrer" }));

app.use(
  cors({
    origin: config.allowedOrigins,
    optionsSuccessStatus: 200,
  }),
);

app.use(cookieParser());
app.use(express.json());

// Rate Limiters
const RateLimiter = (maxRequests: number) =>
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: maxRequests,
    handler: (req, res) => {
      sendErrorResponse(res, 429, "Too many requests, please try again later.");
    },
  });

app.use(RateLimiter(100)); // General rate limiter
app.use("/api", authRoutes, RateLimiter(10));
app.use("/api/medications", medicationRoutes, RateLimiter(50));
app.use("/api/subscriptions", subscriptionRoutes);

// Simulate an error route for testing
app.get("/api/error", (req, res) => {
  throw new Error("Test error");
});

// Enforce HTTPS in non-development environments
if (!["development", "test"].includes(config.nodeEnv)) {
  app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect(301, `https://${req.hostname}${req.url}`);
    }
    next();
  });
}

// Global Error Handler
app.use(errorHandler);

const PORT = config.port ?? 8000;
if (config.nodeEnv !== "test") {
  console.log(`Environment ${config.nodeEnv}`);
  AppDataSource.initialize()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error(`Error during server startup on port ${PORT}`, error);
    });
}

export default app;
