import { errorResponse, successResponse } from "@/lib/api-response";
import { getCrowdPredictions } from "@/services/stadium/data";

export async function GET() {
  try {
    const predictions = getCrowdPredictions();
    return successResponse({ predictions, total: predictions.length });
  } catch (error) {
    console.error("[api/crowd] Error:", error);
    return errorResponse("Failed to fetch crowd predictions", 500, "INTERNAL_ERROR");
  }
}
