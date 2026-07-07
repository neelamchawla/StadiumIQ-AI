import { config } from "@/config";
import { errorResponse, getClientIp, successResponse } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizePromptInput } from "@/lib/sanitize";
import { chatRequestSchema } from "@/schemas";
import { generateWithGemini } from "@/services/ai/gemini.server";
import { SYSTEM_PROMPTS } from "@/services/ai/prompts";
import { generateId } from "@/lib/utils";

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

    const { message, feature, language, context } = parsed.data;
    const sanitizedMessage = sanitizePromptInput(message);

    const contextBlock = context ? `\nContext:\n${JSON.stringify(context)}` : "";
    const languageBlock = language ? `\nPreferred language: ${language}` : "";
    const prompt = `${SYSTEM_PROMPTS[feature]}${languageBlock}${contextBlock}\n\nUser: ${sanitizedMessage}`;

    const result = await generateWithGemini({ feature, prompt });

    return successResponse({
      id: generateId(),
      message: result.message,
      confidence: result.confidence,
      feature,
      conversationId: parsed.data.conversationId ?? generateId(),
    });
  } catch (error) {
    console.error("[api/ai/chat] Error:", error);
    return errorResponse("Failed to process chat request", 500, "INTERNAL_ERROR");
  }
}
