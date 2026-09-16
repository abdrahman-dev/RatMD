import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { llmKeySchema } from '../controllers/profile/profileValidation.js';
import {
    getProfile,
    updateProfile,
    updateLlmKey
} from '../controllers/profile/profileController.js';

const router = express.Router();

router.get('/', authMiddleware, getProfile);
router.put('/', authMiddleware, updateProfile);
router.put('/llm-key', authMiddleware, validate(llmKeySchema), updateLlmKey);

export default router;
