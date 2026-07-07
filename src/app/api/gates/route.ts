import { errorResponse, successResponse } from "@/lib/api-response";
import { getGateStatuses } from "@/services/stadium/data";

export async function GET() {
  try {
    const gates = getGateStatuses();
    return successResponse({ gates, total: gates.length });
  } catch (error) {
    console.error("[api/gates] Error:", error);
    return errorResponse("Failed to fetch gate statuses", 500, "INTERNAL_ERROR");
  }
}
