import OpenAI from "openai";

export function createLLMClient(apiKey) {
  const baseURL = process.env.LLM_BASE_URL || "https://openrouter.ai/api/v1";
  return new OpenAI({
    baseURL,
    apiKey,
    maxRetries: 0,
    timeout: 30 * 1000,
  });
}

export function getLLMConfig() {
  return {
    model: process.env.LLM_MODEL || "openai/gpt-4o-mini",
    baseURL: process.env.LLM_BASE_URL || "https://openrouter.ai/api/v1",
  };
}
