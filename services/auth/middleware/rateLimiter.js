import rateLimit from "express-rate-limit";
import { env } from '../config/env.js';

const isDevelopment = env.NODE_ENV === 'development';
const devMax = 1000;

const jsonTooMany = (message) => (req, res) => {
    res.status(429).json({ success: false, message });
};

// Global limiter (for all routes)

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per IP
    standardHeaders: true,
    legacyHeaders: false,
    handler: jsonTooMany("Too many requests, please try again later")
});

export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour 
    max: isDevelopment ? devMax : 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: jsonTooMany("Too many accounts created, try again after an hour")
});

export const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isDevelopment ? devMax : 20,
    standardHeaders: true,
    legacyHeaders: false,
    handler: jsonTooMany("Too many refresh attempts, try again later")
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isDevelopment ? devMax : 5, // max 5 login attempts
    standardHeaders: true,
    legacyHeaders: false,
    handler: jsonTooMany("Too many login attempts, try again after 15 minutes")
});
