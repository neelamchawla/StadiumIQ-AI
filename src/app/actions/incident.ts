"use server";

import { generateId } from "@/lib/utils";
import { incidentReportSchema, type IncidentReportInput } from "@/schemas";
import type { IncidentReport } from "@/types";

export interface IncidentActionResult {
  success: boolean;
  data?: IncidentReport;
  error?: string;
}

export async function submitIncidentReport(
  input: IncidentReportInput,
): Promise<IncidentActionResult> {
  try {
    const parsed = incidentReportSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors.map((e) => e.message).join(", "),
      };
    }

    const report: IncidentReport = {
      id: generateId(),
      type: parsed.data.type,
      description: parsed.data.description,
      location: parsed.data.location,
      severity: parsed.data.severity,
      reportedBy: "anonymous",
      status: "open",
      createdAt: new Date().toISOString(),
    };

    // Mock persistence — replace with Firestore in production
    return { success: true, data: report };
  } catch (error) {
    console.error("[actions/incident] Error:", error);
    return { success: false, error: "Failed to submit incident report" };
  }
}
