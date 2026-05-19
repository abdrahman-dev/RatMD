import { z } from 'zod';

export const saveConversionSchema = z.object({
    filename: z
        .string()
        .min(1, "Filename is required")
        .max(255, "Filename must be at most 255 characters"),
    originalTokens: z
        .number()
        .int("Original tokens must be an integer")
        .positive("Original tokens must be positive"),
    optimizedTokens: z
        .number()
        .int("Optimized tokens must be an integer")
        .nonnegative("Optimized tokens must be non-negative"),
    savingsPercent: z
        .number()
        .min(0, "Savings percent must be at least 0")
        .max(100, "Savings percent must be at most 100")
}).refine((data) => data.optimizedTokens <= data.originalTokens, {
    message: "Optimized tokens cannot exceed original tokens",
    path: ["optimizedTokens"]
});

export const avatarSchema = z.object({
    avatar: z
        .string()
        .refine(
            (val) => ['rat_default', 'rat_ninja', 'rat_hacker', 'rat_king', 'rat_ghost'].includes(val),
            { message: "Avatar must be one of: rat_default, rat_ninja, rat_hacker, rat_king, rat_ghost" }
        )
});
