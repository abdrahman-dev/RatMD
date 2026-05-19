import conversionModel from '../../model/conversionModel.js';
import userModel from '../../model/userModel.js';
import { AppError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';

const RANK_THRESHOLDS = [
    { threshold: 1000000, rank: 'Rat King' },
    { threshold: 500000, rank: 'Pack Leader' },
    { threshold: 100000, rank: 'Tunnel Rat' },
    { threshold: 10000, rank: 'Gnawer' },
    { threshold: 0, rank: 'Rookie Rat' }
];

function computeRatRank(totalTokensSaved) {
    for (const { threshold, rank } of RANK_THRESHOLDS) {
        if (totalTokensSaved >= threshold) {
            return rank;
        }
    }
    return 'Rookie Rat';
}

export const saveConversion = async (req, res, next) => {
    try {
        const { filename, originalTokens, optimizedTokens, savingsPercent } = req.body;
        const userId = req.user.userId;

        const conversion = await conversionModel.create({
            userId,
            filename,
            originalTokens,
            optimizedTokens,
            savingsPercent
        });

        const tokensSaved = originalTokens - optimizedTokens;

        const user = await userModel.findById(userId);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        user.totalTokensSaved += tokensSaved;
        user.totalConversions += 1;
        user.ratRank = computeRatRank(user.totalTokensSaved);
        await user.save();

        logger.info('Conversion saved', { userId, filename, tokensSaved });

        return res.status(201).json({
            success: true,
            conversion,
            updatedStats: {
                totalTokensSaved: user.totalTokensSaved,
                totalConversions: user.totalConversions,
                ratRank: user.ratRank
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getConversionHistory = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const conversions = await conversionModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await conversionModel.countDocuments({ userId });

        return res.status(200).json({
            success: true,
            conversions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getConversionStats = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const user = await userModel.findById(userId).select('totalTokensSaved totalConversions avatar ratRank');
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        const aggregations = await conversionModel.aggregate([
            { $match: { userId: user._id } },
            {
                $group: {
                    _id: null,
                    avgSavingsPercent: { $avg: '$savingsPercent' }
                }
            }
        ]);

        const avgSavingsPercent = aggregations.length > 0
            ? Math.round(aggregations[0].avgSavingsPercent * 100) / 100
            : 0;

        return res.status(200).json({
            success: true,
            stats: {
                totalTokensSaved: user.totalTokensSaved,
                totalConversions: user.totalConversions,
                avgSavingsPercent,
                ratRank: user.ratRank,
                avatar: user.avatar
            }
        });
    } catch (error) {
        next(error);
    }
};
