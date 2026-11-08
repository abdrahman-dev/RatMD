import express from 'express';
import { validate } from '../middleware/validate.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { registerSchema, loginSchema, changePasswordSchema } from '../controllers/auth/authValidation.js'; 
import {
    getApiStatus,
    registerUser,
    loginUser,
    logoutUser,
    refreshTokenController,
    getMe,
    changePassword
} from '../controllers/auth/authController.js'; 
import { 
    authLimiter,
    registerLimiter,
    refreshLimiter,
} from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', getApiStatus);
router.post('/register', registerLimiter, validate(registerSchema), registerUser);
router.post('/login', authLimiter, validate(loginSchema), loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshLimiter, refreshTokenController);
router.get('/me', authMiddleware, getMe);
router.post('/change-password', authMiddleware, validate(changePasswordSchema), changePassword);

export default router;
