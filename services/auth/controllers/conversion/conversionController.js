import conversionModel from '../../model/conversionModel.js';
import userModel from '../../model/userModel.js';
import { AppError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { decrypt } from '../../utils/encryption.js';
import { createLLMClient, getLLMConfig } from '../../utils/llmClient.js';

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

const ENHANCE_SYSTEM_PROMPT = `You clean up Markdown text that was automatically extracted from a PDF document.

Your tasks:
- Fix broken heading hierarchy and heading formatting
- Remove page numbers, repeated headers, footers, and other extraction artifacts
- Fix broken tables so they render as valid Markdown tables
- Join lines that were split mid-sentence by the extraction process

Rules:
- Preserve ALL content. Do not summarize, shorten, or omit any information.
- Return ONLY the cleaned Markdown, with no commentary, explanation, or code fences.`;

export const enhanceConversion = async (req, res, next) => {
    try {
        const { markdown, filename } = req.body;
        const userId = req.user.userId;

        const user = await userModel.findById(userId);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        if (!user.openRouterApiKey) {
            return res.status(400).json({
                success: false,
                message: "No OpenRouter key on file. Add one in your profile first."
            });
        }

        let apiKey;
        try {
            apiKey = decrypt(user.openRouterApiKey);
        } catch (error) {
            logger.warn('LLM key decrypt failed', { userId });
            return res.status(200).json({
                success: true,
                enhanced: false,
                markdown,
                reason: "Could not read the saved API key. Please re-add it in your profile."
            });
        }

        try {
            const client = createLLMClient(apiKey);
            const { model } = getLLMConfig();

            const completion = await client.chat.completions.create({
                model,
                messages: [
                    { role: 'system', content: ENHANCE_SYSTEM_PROMPT },
                    { role: 'user', content: markdown }
                ]
            });

            const cleanedMarkdown = completion.choices?.[0]?.message?.content?.trim();

            if (!cleanedMarkdown) {
                return res.status(200).json({
                    success: true,
                    enhanced: false,
                    markdown,
                    reason: "The AI returned an empty response. Original markdown kept."
                });
            }

            logger.info('Conversion enhanced', { userId, filename });

            return res.status(200).json({
                success: true,
                enhanced: true,
                markdown: cleanedMarkdown,
                usage: {
                    model,
                    inputTokens: completion.usage?.prompt_tokens ?? 0,
                    outputTokens: completion.usage?.completion_tokens ?? 0
                }
            });
        } catch (error) {
            logger.warn('LLM enhancement failed', { userId, filename });
            return res.status(200).json({
                success: true,
                enhanced: false,
                markdown,
                reason: "AI enhancement failed (bad key, rate limit, or timeout). Original markdown kept."
            });
        }
    } catch (error) {
        next(error);
    }
};
