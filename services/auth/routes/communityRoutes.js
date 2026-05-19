import express from 'express';
import { validate } from '../middleware/validate.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { avatarSchema } from '../controllers/conversion/conversionValidation.js';
import {
    getLeaderboard,
    updateAvatar,
    getPublicProfile
} from '../controllers/community/communityController.js';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.put('/avatar', authMiddleware, validate(avatarSchema), updateAvatar);
router.get('/profile/:userId', getPublicProfile);

export default router;
