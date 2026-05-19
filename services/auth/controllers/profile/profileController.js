import userModel from '../../model/userModel.js';
import { AppError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';

const ALLOWED_AVATARS = ['rat_default', 'rat_ninja', 'rat_hacker', 'rat_king', 'rat_ghost'];

export const getProfile = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user.userId).select('-password -verifyOTP -verifyOTPExpire -resetOTP -resetOTPExpire -isAccountVerified');
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        return res.status(200).json({
            success: true,
            profile: {
                name: user.name,
                email: user.email,
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

export const updateProfile = async (req, res, next) => {
    try {
        const { name, bio, github, linkedin, avatar } = req.body;
        const userId = req.user.userId;

        if (avatar && !ALLOWED_AVATARS.includes(avatar)) {
            return next(new AppError('Invalid avatar value', 400));
        }

        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (bio !== undefined) updateFields.bio = bio;
        if (github !== undefined) updateFields.github = github;
        if (linkedin !== undefined) updateFields.linkedin = linkedin;
        if (avatar !== undefined) updateFields.avatar = avatar;

        const user = await userModel.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true, runValidators: true }
        ).select('-password -verifyOTP -verifyOTPExpire -resetOTP -resetOTPExpire -isAccountVerified');

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        logger.info('Profile updated', { userId });

        return res.status(200).json({
            success: true,
            profile: {
                name: user.name,
                email: user.email,
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
