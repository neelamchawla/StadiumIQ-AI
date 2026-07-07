"use server";

import { config } from "@/config";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizePromptInput } from "@/lib/sanitize";
import { generateId } from "@/lib/utils";
import { chatRequestSchema, type ChatRequest } from "@/schemas";
import { generateWithGemini } from "@/services/ai/gemini.server";
import { SYSTEM_PROMPTS } from "@/services/ai/prompts";
import { headers } from "next/headers";

export interface ChatActionResult {
  success: boolean;
  data?: {
    id: string;
    message: string;
    confidence?: number;
    feature: ChatRequest["feature"];
    conversationId: string;
  };
  error?: string;
}

export async function sendChatMessage(input: ChatRequest): Promise<ChatActionResult> {
  try {
    const headersList = await headers();
    const clientIp =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      headersList.get("x-real-ip") ??
      "anonymous";

    const rateLimit = checkRateLimit(`chat-action:${clientIp}`, {
      limit: config.ai.rateLimitPerMinute,
      windowMs: 60_000,
    });

    if (!rateLimit.success) {
      return { success: false, error: "Too many requests. Please try again later." };
    }

    const parsed = chatRequestSchema.safeParse(input);

    if (!parsed.success) {
      return { success: false, error: "Invalid chat request" };
    }

    const { message, feature, language, context } = parsed.data;
    const sanitizedMessage = sanitizePromptInput(message);

    const contextBlock = context ? `\nContext:\n${JSON.stringify(context)}` : "";
    const languageBlock = language ? `\nPreferred language: ${language}` : "";
    const prompt = `${SYSTEM_PROMPTS[feature]}${languageBlock}${contextBlock}\n\nUser: ${sanitizedMessage}`;

    const result = await generateWithGemini({ feature, prompt });

    return {
      success: true,
      data: {
        id: generateId(),
        message: result.message,
        confidence: result.confidence,
        feature,
        conversationId: parsed.data.conversationId ?? generateId(),
      },
    };
  } catch (error) {
    console.error("[actions/chat] Error:", error);
    return { success: false, error: "Failed to process chat message" };
  }
}
