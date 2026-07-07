import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "@/config";
import { FALLBACK_RESPONSES } from "@/services/ai/prompts";
import type { AIFeature } from "@/types";

export interface GenerateAIInput {
  feature: AIFeature;
  prompt: string;
}

export async function generateWithGemini(input: GenerateAIInput) {
  if (!config.ai.geminiApiKey) {
    return {
      message: FALLBACK_RESPONSES[input.feature],
      confidence: 0.5,
    };
  }

  const genAI = new GoogleGenerativeAI(config.ai.geminiApiKey);
  const model = genAI.getGenerativeModel({ model: config.ai.model });

  const result = await model.generateContent(input.prompt);
  const response = result.response.text();

  return {
    message: response,
    confidence: 0.9,
  };
}
