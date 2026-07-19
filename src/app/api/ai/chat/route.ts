import { config } from "@/config";
import { errorResponse, getClientIp, successResponse } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizePromptInput } from "@/lib/sanitize";
import { generateId } from "@/lib/utils";
import { chatRequestSchema } from "@/schemas";
import {
  buildStadiumContext,
  formatContextBlock,
  sanitizeAIContext,
} from "@/services/ai/context";
import { generateWithGemini } from "@/services/ai/gemini.server";

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`chat:${clientIp}`, {
      limit: config.ai.rateLimitPerMinute,
      windowMs: 60_000,
    });

    if (!rateLimit.success) {
      return errorResponse("Too many requests. Please try again later.", 429, "RATE_LIMITED", {
        resetAt: rateLimit.resetAt,
      });
    }

    const body: unknown = await request.json();
    const parsed = chatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Invalid request body", 400, "VALIDATION_ERROR", parsed.error.flatten());
    }

    const { message, feature, language } = parsed.data;
    const safeContext = sanitizeAIContext(parsed.data.context);
    const stadiumContext = buildStadiumContext(feature, {
      ...safeContext,
      language: safeContext.language ?? language,
    });

    const result = await generateWithGemini({
      feature,
      userPrompt: sanitizePromptInput(message),
      language,
      contextBlock: formatContextBlock(stadiumContext),
    });

    return successResponse({
      id: generateId(),
      message: result.message,
      confidence: result.confidence,
      feature,
      source: result.source,
      conversationId: parsed.data.conversationId ?? generateId(),
    });
  } catch (error) {
    console.error("[api/ai/chat] Error:", error);
    return errorResponse("Failed to process chat request", 500, "INTERNAL_ERROR");
  }
}
