import { getGateStatuses, getRouteRecommendations, getWeatherAlert } from "@/services/stadium/data";
import type { AccessibilityNeeds, GateStatus, RouteRecommendation } from "@/types";

export interface BestGateRecommendation {
  gate: GateStatus;
  predictedWaitMinutes: number;
  congestionLevel: GateStatus["congestionLevel"];
  reason: string;
  alternatives: GateStatus[];
  route?: RouteRecommendation;
  weatherNote: string;
  requireAccessible: boolean;
  generatedAt: string;
}

function scoreGate(gate: GateStatus, requireAccessible: boolean): number {
  if (gate.status !== "open") return Number.POSITIVE_INFINITY;
  if (requireAccessible && !gate.isAccessible) return Number.POSITIVE_INFINITY;

  const congestionPenalty =
    gate.congestionLevel === "low"
      ? 0
      : gate.congestionLevel === "moderate"
        ? 8
        : gate.congestionLevel === "high"
          ? 18
          : 30;

  return gate.waitTimeMinutes + congestionPenalty;
}

/**
 * Deterministic best-gate decision engine used by the hero flow and AI context.
 */
export function recommendBestGate(options?: {
  requireAccessible?: boolean;
  accessibilityNeeds?: Partial<AccessibilityNeeds>;
}): BestGateRecommendation {
  const requireAccessible = Boolean(
    options?.requireAccessible ||
      options?.accessibilityNeeds?.wheelchair ||
      options?.accessibilityNeeds?.mobilityAssistance,
  );

  const gates = getGateStatuses().filter((gate) => gate.status === "open");
  const ranked = [...gates].sort(
    (a, b) => scoreGate(a, requireAccessible) - scoreGate(b, requireAccessible),
  );

  const best = ranked[0] ?? gates[0];
  const alternatives = ranked.slice(1, 3);
  const routes = getRouteRecommendations();
  const route = requireAccessible
    ? routes.find((item) => item.accessibilityScore >= 90) ?? routes[0]
    : routes.find((item) => item.id === "route-fast") ?? routes[0];
  const weather = getWeatherAlert();

  const reason = requireAccessible
    ? `${best.name} is the fastest open accessible entrance (~${best.waitTimeMinutes} min wait, ${best.congestionLevel} congestion).`
    : `${best.name} currently has the shortest predicted wait (~${best.waitTimeMinutes} min) with ${best.congestionLevel} congestion.`;

  return {
    gate: best,
    predictedWaitMinutes: best.waitTimeMinutes,
    congestionLevel: best.congestionLevel,
    reason,
    alternatives,
    route,
    weatherNote: weather.message,
    requireAccessible,
    generatedAt: new Date().toISOString(),
  };
}
