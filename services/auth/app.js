import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import connectDB from './model/mongodb.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

// Import router for authentication endpoints (login, register, logout, refresh)
import authRoutes from './routes/authRoutes.js'
import conversionRoutes from './routes/conversionRoutes.js'
import communityRoutes from './routes/communityRoutes.js'
import profileRoutes from './routes/profileRoutes.js'

import errorHandler from './middleware/errorHandler.js';


const app = express();
const port = env.PORT;

if (env.TRUST_PROXY > 0) {
    app.set('trust proxy', env.TRUST_PROXY);
}

// Security headers
app.use(helmet());

// Middleware setup for JSON parsing, CORS with frontend, and cookie handling
app.use(express.json({ limit: '2mb' }));
app.use(cors({
  origin: env.ALLOWED_ORIGINS,
  credentials: true               
}));
app.use(cookieParser());

// Register route handlers with rate limiting and API endpoints
app.use(globalLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/conversions', conversionRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/profile', profileRoutes);

// Global error handling middleware
app.use(errorHandler);

// Establish connection to MongoDB database
try {
    await connectDB();
} catch (error) {
    logger.error('Failed to connect to MongoDB', error);
    process.exit(1);
}

// Start the Express server on specified port
app.listen(port, () => {
    logger.info(`Running on PORT:${port}`);
});