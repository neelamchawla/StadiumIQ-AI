import { errorResponse, successResponse } from "@/lib/api-response";
import { recommendBestGate } from "@/services/stadium/recommendations";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requireAccessible = searchParams.get("accessible") === "1";
    const recommendation = recommendBestGate({ requireAccessible });
    return successResponse(recommendation);
  } catch (error) {
    console.error("[api/gates/recommend] Error:", error);
    return errorResponse("Failed to recommend gate", 500, "INTERNAL_ERROR");
  }
}
