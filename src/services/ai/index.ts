"use client";

import { sendChatMessage } from "@/app/actions/chat";
import type { AIFeature, ChatMessage, SupportedLanguage } from "@/types";
import type { SafeAIContext } from "@/services/ai/context";

export interface AskStadiumAIInput {
  feature: AIFeature;
  message: string;
  history?: ChatMessage[];
  language?: SupportedLanguage | string;
  context?: SafeAIContext;
}

/**
 * Client entrypoint — always goes through the server action (never exposes Gemini key).
 */
export async function askStadiumAI(input: AskStadiumAIInput) {
  const result = await sendChatMessage({
    feature: input.feature,
    message: input.message,
    language: (input.language as SupportedLanguage | undefined) ?? "en",
    context: input.context,
  });

  if (!result.success || !result.data) {
    throw new Error(result.error ?? "AI request failed");
  }

  return {
    message: result.data.message,
    confidence: result.data.confidence,
    feature: result.data.feature,
    source: result.data.source,
    conversationId: result.data.conversationId,
  };
}
