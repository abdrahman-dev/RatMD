import express from 'express';
import { validate } from '../middleware/validate.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { saveConversionSchema } from '../controllers/conversion/conversionValidation.js';
import {
    saveConversion,
    getConversionHistory,
    getConversionStats
} from '../controllers/conversion/conversionController.js';

const router = express.Router();

router.post('/save', authMiddleware, validate(saveConversionSchema), saveConversion);
router.get('/history', authMiddleware, getConversionHistory);
router.get('/stats', authMiddleware, getConversionStats);

export default router;
