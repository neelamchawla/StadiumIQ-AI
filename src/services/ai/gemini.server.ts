import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "@/config";
import { FALLBACK_RESPONSES, SYSTEM_PROMPTS } from "@/services/ai/prompts";
import type { AIFeature } from "@/types";

export interface GenerateAIInput {
  feature: AIFeature;
  /** User message / task content (never a full attacker-controlled system prompt) */
  userPrompt: string;
  /** Optional structured stadium context (already allowlisted) */
  contextBlock?: string;
  language?: string;
}

let client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI | null {
  if (!config.ai.geminiApiKey) return null;
  if (!client) {
    client = new GoogleGenerativeAI(config.ai.geminiApiKey);
  }
  return client;
}

function buildUserContent(input: GenerateAIInput): string {
  const parts = [input.userPrompt];
  if (input.language) {
    parts.unshift(`Preferred language: ${input.language}`);
  }
  if (input.contextBlock) {
    parts.push(`Stadium context (authoritative simulated data):\n${input.contextBlock}`);
  }
  return parts.join("\n\n");
}

export async function generateWithGemini(input: GenerateAIInput) {
  const ai = getClient();

  if (!ai) {
    return {
      message: FALLBACK_RESPONSES[input.feature],
      confidence: 0.5,
      source: "fallback" as const,
    };
  }

  try {
    const model = ai.getGenerativeModel({
      model: config.ai.model,
      systemInstruction: SYSTEM_PROMPTS[input.feature],
      generationConfig: {
        maxOutputTokens: config.ai.maxTokens,
        temperature: 0.4,
      },
    });

    const result = await model.generateContent(buildUserContent(input));
    const response = result.response.text().trim();

    if (!response) {
      return {
        message: FALLBACK_RESPONSES[input.feature],
        confidence: 0.5,
        source: "fallback" as const,
      };
    }

    return {
      message: response,
      confidence: 0.9,
      source: "gemini" as const,
    };
  } catch (error) {
    console.error("[gemini.server] Generation failed:", error);
    return {
      message: FALLBACK_RESPONSES[input.feature],
      confidence: 0.5,
      source: "fallback" as const,
    };
  }
}

/** @deprecated Use generateWithGemini with userPrompt + systemInstruction */
export async function generateWithGeminiLegacy(input: {
  feature: AIFeature;
  prompt: string;
}) {
  return generateWithGemini({
    feature: input.feature,
    userPrompt: input.prompt,
  });
}
