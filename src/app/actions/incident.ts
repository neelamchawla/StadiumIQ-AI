"use server";

import { config } from "@/config";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizePromptInput } from "@/lib/sanitize";
import { generateId } from "@/lib/utils";
import { incidentReportSchema, type IncidentReportInput } from "@/schemas";
import { addIncident } from "@/services/stadium/incidents";
import type { IncidentReport } from "@/types";
import { headers } from "next/headers";

export interface IncidentActionResult {
  success: boolean;
  data?: IncidentReport;
  error?: string;
}

const TYPE_LABELS: Record<string, string> = {
  crowd: "Crowd Density",
  accessibility: "Accessibility",
  medical: "Medical",
  security: "Security",
  other: "Other",
};

export async function submitIncidentReport(
  input: IncidentReportInput,
): Promise<IncidentActionResult> {
  try {
    const headersList = await headers();
    const clientIp =
      headersList.get("x-real-ip") ??
      headersList.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ??
      headersList.get("x-forwarded-for")?.split(",").at(-1)?.trim() ??
      "anonymous";

    const rateLimit = checkRateLimit(`incident:${clientIp}`, {
      limit: Math.min(10, config.ai.rateLimitPerMinute),
      windowMs: 60_000,
    });

    if (!rateLimit.success) {
      return { success: false, error: "Too many incident reports. Please try again later." };
    }

    const parsed = incidentReportSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors.map((e) => e.message).join(", "),
      };
    }

    const report: IncidentReport = {
      id: generateId(),
      type: TYPE_LABELS[parsed.data.type] ?? sanitizePromptInput(parsed.data.type),
      description: sanitizePromptInput(parsed.data.description),
      location: sanitizePromptInput(parsed.data.location),
      severity: parsed.data.severity,
      reportedBy: "demo-volunteer",
      status: "open",
      createdAt: new Date().toISOString(),
    };

    addIncident(report);
    return { success: true, data: report };
  } catch (error) {
    console.error("[actions/incident] Error:", error);
    return { success: false, error: "Failed to submit incident report" };
  }
}

export async function fetchIncidents(): Promise<IncidentReport[]> {
  const { listIncidents } = await import("@/services/stadium/incidents");
  return listIncidents();
}
