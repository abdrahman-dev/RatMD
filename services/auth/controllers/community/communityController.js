import userModel from '../../model/userModel.js';
import { AppError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';

export const getLeaderboard = async (req, res, next) => {
    try {
        const users = await userModel
            .find({})
            .sort({ totalTokensSaved: -1 })
            .limit(20)
            .select('name avatar ratRank totalTokensSaved totalConversions -_id');

        return res.status(200).json({
            success: true,
            leaderboard: users
        });
    } catch (error) {
        next(error);
    }
};

export const updateAvatar = async (req, res, next) => {
    try {
        const { avatar } = req.body;
        const userId = req.user.userId;

        const user = await userModel.findByIdAndUpdate(
            userId,
            { avatar },
            { new: true, runValidators: true }
        ).select('name avatar ratRank totalTokensSaved totalConversions');

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        logger.info('Avatar updated', { userId, avatar });

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

export const getPublicProfile = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.params.userId).select('name avatar ratRank totalTokensSaved totalConversions bio github linkedin');
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        return res.status(200).json({
            success: true,
            profile: {
                name: user.name,
                avatar: user.avatar,
                ratRank: user.ratRank,
                totalTokensSaved: user.totalTokensSaved,
                totalConversions: user.totalConversions,
                bio: user.bio,
                github: user.github,
                linkedin: user.linkedin
            }
        });
    } catch (error) {
        next(error);
    }
};
