import { z } from 'zod';

export const llmKeySchema = z.object({
    apiKey: z
        .string()
        .min(10, "OpenRouter API key must be at least 10 characters")
        .max(500, "OpenRouter API key must be at most 500 characters")
});
