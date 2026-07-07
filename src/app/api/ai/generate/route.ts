import { z } from "zod";
import { config } from "@/config";
import { errorResponse, getClientIp, successResponse } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/rate-limit";
import { generateWithGemini } from "@/services/ai/gemini.server";

const generateRequestSchema = z.object({
  feature: z.enum([
    "assistant",
    "crowd_prediction",
    "route_recommendation",
    "accessibility",
    "emergency",
    "sustainability",
    "volunteer",
    "organizer",
  ]),
  prompt: z.string().min(1, "Prompt is required").max(10_000, "Prompt too long"),
});

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`generate:${clientIp}`, {
      limit: config.ai.rateLimitPerMinute,
      windowMs: 60_000,
    });

    if (!rateLimit.success) {
      return errorResponse("Too many requests. Please try again later.", 429, "RATE_LIMITED", {
        resetAt: rateLimit.resetAt,
      });
    }

    const body: unknown = await request.json();
    const parsed = generateRequestSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Invalid request body", 400, "VALIDATION_ERROR", parsed.error.flatten());
    }

    const result = await generateWithGemini(parsed.data);

    return successResponse({
      message: result.message,
      confidence: result.confidence,
      feature: parsed.data.feature,
    });
  } catch (error) {
    console.error("[api/ai/generate] Error:", error);
    return errorResponse("Failed to generate AI response", 500, "INTERNAL_ERROR");
  }
}
