import { errorResponse } from "@/lib/api-response";

/**
 * Raw-prompt generation is intentionally disabled.
 * Clients must use POST /api/ai/chat or the sendChatMessage server action.
 */
export async function POST() {
  return errorResponse(
    "Raw prompt generation is disabled. Use /api/ai/chat with a user message and feature.",
    410,
    "ENDPOINT_REMOVED",
  );
}
