import { sanitizePromptInput } from "@/lib/sanitize";
import {
  getCrowdPredictions,
  getGateStatuses,
  getHelpCenters,
  getWeatherAlert,
} from "@/services/stadium/data";
import type { AccessibilityNeeds, AIFeature, SupportedLanguage, UserRole } from "@/types";

/** Allowlisted context fields accepted from clients */
export interface SafeAIContext {
  role?: UserRole;
  language?: SupportedLanguage;
  accessibilityNeeds?: Partial<AccessibilityNeeds>;
  emergencyType?: string;
  preferredGate?: string;
  requireAccessible?: boolean;
  location?: string;
  includeStadiumData?: boolean;
}

const ROLE_VALUES = new Set(["fan", "volunteer", "organizer", "staff", "security"]);
const LANGUAGE_VALUES = new Set(["en", "es", "fr", "de", "pt", "ar", "zh", "ja", "ko"]);

function asBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function asString(value: unknown, max = 200): string | undefined {
  if (typeof value !== "string") return undefined;
  const cleaned = sanitizePromptInput(value).slice(0, max);
  return cleaned || undefined;
}

/**
 * Allowlist and sanitize free-form client context before prompt injection.
 */
export function sanitizeAIContext(raw: unknown): SafeAIContext {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }

  const input = raw as Record<string, unknown>;
  const safe: SafeAIContext = {};

  if (typeof input.role === "string" && ROLE_VALUES.has(input.role)) {
    safe.role = input.role as UserRole;
  }

  if (typeof input.language === "string" && LANGUAGE_VALUES.has(input.language)) {
    safe.language = input.language as SupportedLanguage;
  }

  if (input.accessibilityNeeds && typeof input.accessibilityNeeds === "object") {
    const needs = input.accessibilityNeeds as Record<string, unknown>;
    safe.accessibilityNeeds = {
      wheelchair: asBoolean(needs.wheelchair) ?? false,
      visualImpairment: asBoolean(needs.visualImpairment) ?? false,
      hearingImpairment: asBoolean(needs.hearingImpairment) ?? false,
      mobilityAssistance: asBoolean(needs.mobilityAssistance) ?? false,
      companionRequired: asBoolean(needs.companionRequired) ?? false,
    };
  }

  const emergencyType = asString(input.emergencyType, 40);
  if (emergencyType) safe.emergencyType = emergencyType;

  const preferredGate = asString(input.preferredGate, 40);
  if (preferredGate) safe.preferredGate = preferredGate;

  const location = asString(input.location, 120);
  if (location) safe.location = location;

  const requireAccessible = asBoolean(input.requireAccessible);
  if (requireAccessible !== undefined) safe.requireAccessible = requireAccessible;

  const includeStadiumData = asBoolean(input.includeStadiumData);
  if (includeStadiumData !== undefined) safe.includeStadiumData = includeStadiumData;

  return safe;
}

/**
 * Build stadium decision context for AI prompts from live mock/API data.
 */
export function buildStadiumContext(
  feature: AIFeature,
  clientContext: SafeAIContext = {},
): Record<string, unknown> {
  const gates = getGateStatuses();
  const crowd = getCrowdPredictions();
  const weather = getWeatherAlert();
  const helpCenters = getHelpCenters();

  const sortedByWait = [...gates].sort((a, b) => a.waitTimeMinutes - b.waitTimeMinutes);
  const accessibleGates = gates.filter((gate) => gate.isAccessible && gate.status === "open");
  const bestGate =
    clientContext.requireAccessible || clientContext.accessibilityNeeds?.wheelchair
      ? accessibleGates.sort((a, b) => a.waitTimeMinutes - b.waitTimeMinutes)[0] ?? sortedByWait[0]
      : sortedByWait[0];

  const context: Record<string, unknown> = {
    venue: "MetLife Stadium",
    dataMode: "simulated-match-day",
    generatedAt: new Date().toISOString(),
    weather: {
      condition: weather.condition,
      temperatureF: weather.temperature,
      alertLevel: weather.alertLevel,
      message: weather.message,
    },
    gates: gates.map((gate) => ({
      id: gate.id,
      name: gate.name,
      congestionLevel: gate.congestionLevel,
      waitTimeMinutes: gate.waitTimeMinutes,
      isAccessible: gate.isAccessible,
      status: gate.status,
    })),
    bestGateNow: bestGate
      ? {
          id: bestGate.id,
          name: bestGate.name,
          waitTimeMinutes: bestGate.waitTimeMinutes,
          congestionLevel: bestGate.congestionLevel,
          isAccessible: bestGate.isAccessible,
        }
      : null,
    crowdSummary: crowd
      .slice()
      .sort((a, b) => a.predictedWaitMinutes - b.predictedWaitMinutes)
      .slice(0, 3)
      .map((item) => ({
        gate: item.gateName,
        wait: item.predictedWaitMinutes,
        congestion: item.congestionLevel,
      })),
  };

  if (clientContext.role) context.userRole = clientContext.role;
  if (clientContext.language) context.preferredLanguage = clientContext.language;
  if (clientContext.accessibilityNeeds) {
    context.accessibilityNeeds = clientContext.accessibilityNeeds;
  }
  if (clientContext.preferredGate) context.preferredGate = clientContext.preferredGate;
  if (clientContext.location) context.userLocation = clientContext.location;
  if (clientContext.requireAccessible !== undefined) {
    context.requireAccessible = clientContext.requireAccessible;
  }

  if (feature === "emergency" || clientContext.emergencyType) {
    context.emergencyType = clientContext.emergencyType ?? "general";
    context.nearestHelpCenters = helpCenters
      .slice()
      .sort((a, b) => a.distanceMeters - b.distanceMeters)
      .slice(0, 4)
      .map((center) => ({
        name: center.name,
        type: center.type,
        distanceMeters: center.distanceMeters,
        waitTimeMinutes: center.waitTimeMinutes,
      }));
  }

  if (feature === "accessibility" || feature === "route_recommendation") {
    context.accessibleGates = accessibleGates.map((gate) => gate.name);
  }

  return context;
}

export function formatContextBlock(context: Record<string, unknown>): string {
  return JSON.stringify(context, null, 0).slice(0, 4000);
}
