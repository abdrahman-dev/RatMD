import express from 'express';
import { validate } from '../middleware/validate.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { saveConversionSchema, enhanceConversionSchema } from '../controllers/conversion/conversionValidation.js';
import {
    saveConversion,
    getConversionHistory,
    getConversionStats,
    enhanceConversion
} from '../controllers/conversion/conversionController.js';

const router = express.Router();

router.post('/save', authMiddleware, validate(saveConversionSchema), saveConversion);
router.post('/enhance', authMiddleware, validate(enhanceConversionSchema), enhanceConversion);
router.get('/history', authMiddleware, getConversionHistory);
router.get('/stats', authMiddleware, getConversionStats);

export default router;
