"use server";

import { config } from "@/config";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizePromptInput } from "@/lib/sanitize";
import { generateId } from "@/lib/utils";
import { chatRequestSchema, type ChatRequest } from "@/schemas";
import {
  buildStadiumContext,
  formatContextBlock,
  sanitizeAIContext,
} from "@/services/ai/context";
import { generateWithGemini } from "@/services/ai/gemini.server";
import { headers } from "next/headers";

export interface ChatActionResult {
  success: boolean;
  data?: {
    id: string;
    message: string;
    confidence?: number;
    feature: ChatRequest["feature"];
    conversationId: string;
    source?: "gemini" | "fallback";
  };
  error?: string;
}

export async function sendChatMessage(input: ChatRequest): Promise<ChatActionResult> {
  try {
    const headersList = await headers();
    const clientIp =
      headersList.get("x-real-ip") ??
      headersList.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ??
      headersList.get("x-forwarded-for")?.split(",").at(-1)?.trim() ??
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

    const { message, feature, language } = parsed.data;
    const safeContext = sanitizeAIContext(parsed.data.context);
    const stadiumContext = buildStadiumContext(feature, {
      ...safeContext,
      language: safeContext.language ?? language,
    });
    const sanitizedMessage = sanitizePromptInput(message);

    const result = await generateWithGemini({
      feature,
      userPrompt: sanitizedMessage,
      language,
      contextBlock: formatContextBlock(stadiumContext),
    });

    return {
      success: true,
      data: {
        id: generateId(),
        message: result.message,
        confidence: result.confidence,
        feature,
        conversationId: parsed.data.conversationId ?? generateId(),
        source: result.source,
      },
    };
  } catch (error) {
    console.error("[actions/chat] Error:", error);
    return { success: false, error: "Failed to process chat message" };
  }
}
