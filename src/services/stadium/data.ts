import type {
  CrowdPrediction,
  DashboardWidget,
  GateStatus,
  HelpCenter,
  IncidentReport,
  RouteRecommendation,
  SustainabilityMetrics,
  VolunteerTask,
  WeatherAlert,
} from "@/types";
import { GATES, MOCK_VENUE } from "@/constants";

/** Mock data service with mild time-based variation for demo "live" feel */

function minuteBucket(): number {
  return Math.floor(Date.now() / 60_000);
}

function varyWait(base: number, seed: number): number {
  const wobble = ((minuteBucket() + seed) % 5) - 2;
  return Math.max(1, base + wobble);
}

function congestionFromWait(wait: number): GateStatus["congestionLevel"] {
  if (wait <= 7) return "low";
  if (wait <= 14) return "moderate";
  if (wait <= 24) return "high";
  return "critical";
}

export function getGateStatuses(): GateStatus[] {
  return GATES.map((gate, index) => {
    const waitTimeMinutes = varyWait(gate.waitTimeMinutes, index * 3);
    return {
      ...gate,
      waitTimeMinutes,
      congestionLevel: congestionFromWait(waitTimeMinutes),
      currentOccupancy: Math.min(
        gate.capacity,
        Math.round(gate.currentOccupancy * (1 + ((minuteBucket() + index) % 7) * 0.01)),
      ),
    };
  });
}

const GATE_CONFIDENCE: Record<string, number> = {
  "gate-a": 0.92,
  "gate-b": 0.88,
  "gate-c": 0.91,
  "gate-d": 0.89,
  "gate-vip": 0.86,
};

export function getCrowdPredictions(): CrowdPrediction[] {
  return getGateStatuses().map((gate) => ({
    gateId: gate.id,
    gateName: gate.name,
    predictedWaitMinutes: gate.waitTimeMinutes,
    congestionLevel: gate.congestionLevel,
    confidence: GATE_CONFIDENCE[gate.id] ?? 0.88,
    explanation: `${gate.name} has ${gate.congestionLevel} congestion with approximately ${gate.waitTimeMinutes} minute wait.`,
    recommendedAlternative:
      gate.congestionLevel === "high" || gate.congestionLevel === "critical"
        ? "Gate A - North"
        : undefined,
  }));
}

export function getDashboardWidgets(): DashboardWidget[] {
  const gates = getGateStatuses();
  const best = [...gates].sort((a, b) => a.waitTimeMinutes - b.waitTimeMinutes)[0];
  const avgWait = Math.round(
    gates.reduce((sum, gate) => sum + gate.waitTimeMinutes, 0) / Math.max(gates.length, 1),
  );

  return [
    {
      id: "crowd",
      title: "Stadium Capacity",
      type: "crowd",
      value: "68%",
      trend: "up",
      trendValue: "+5%",
      status: "normal",
    },
    {
      id: "gate-a",
      title: "Best Gate",
      type: "gate",
      value: best?.name.split(" - ")[0] ?? "Gate A",
      trend: "stable",
      status: "normal",
    },
    {
      id: "transport",
      title: "Transit Status",
      type: "transport",
      value: "On Time",
      trend: "stable",
      status: "normal",
    },
    {
      id: "weather",
      title: "Weather",
      type: "weather",
      value: "72°F",
      trend: "stable",
      status: "normal",
    },
    {
      id: "volunteers",
      title: "Volunteers Active",
      type: "volunteer",
      value: 342,
      trend: "up",
      trendValue: "+12",
      status: "normal",
    },
    {
      id: "emergency",
      title: "Active Alerts",
      type: "emergency",
      value: 0,
      status: "normal",
    },
    {
      id: "carbon",
      title: "Carbon Saved Today",
      type: "carbon",
      value: "2.4t",
      trend: "up",
      trendValue: "+18%",
      status: "normal",
    },
    {
      id: "ai-rec",
      title: "AI Recommendation",
      type: "ai",
      value: `Use ${best?.name.split(" - ")[0] ?? "Gate A"}`,
      status: "normal",
    },
    {
      id: "queue",
      title: "Avg Queue Time",
      type: "queue",
      value: `${avgWait} min`,
      trend: "down",
      trendValue: "-3 min",
      status: avgWait > 15 ? "warning" : "normal",
    },
    {
      id: "accessibility",
      title: "Accessibility Alerts",
      type: "accessibility",
      value: 1,
      status: "warning",
    },
  ];
}

export function getWeatherAlert(): WeatherAlert {
  return {
    id: "weather-1",
    condition: "Partly Cloudy",
    temperature: 72,
    humidity: 55,
    windSpeed: 8,
    alertLevel: "none",
    message: "Pleasant conditions for outdoor activities. Stay hydrated.",
  };
}

export function getHelpCenters(): HelpCenter[] {
  return [
    {
      id: "medical-1",
      name: "Medical Station A",
      type: "medical",
      lat: MOCK_VENUE.lat + 0.001,
      lng: MOCK_VENUE.lng + 0.001,
      distanceMeters: 120,
      waitTimeMinutes: 2,
    },
    {
      id: "police-1",
      name: "Security Post 3",
      type: "police",
      lat: MOCK_VENUE.lat - 0.001,
      lng: MOCK_VENUE.lng + 0.002,
      distanceMeters: 80,
    },
    {
      id: "info-1",
      name: "Information Desk",
      type: "info",
      lat: MOCK_VENUE.lat,
      lng: MOCK_VENUE.lng - 0.001,
      distanceMeters: 50,
    },
    {
      id: "lost-1",
      name: "Lost & Found Center",
      type: "lost_found",
      lat: MOCK_VENUE.lat + 0.002,
      lng: MOCK_VENUE.lng,
      distanceMeters: 200,
    },
    {
      id: "access-1",
      name: "Accessibility Services",
      type: "accessibility",
      lat: MOCK_VENUE.lat - 0.002,
      lng: MOCK_VENUE.lng - 0.001,
      distanceMeters: 150,
    },
  ];
}

export function getRouteRecommendations(): RouteRecommendation[] {
  return [
    {
      id: "route-accessible",
      name: "Accessible Route via Gate A",
      distanceMeters: 450,
      estimatedMinutes: 8,
      accessibilityScore: 95,
      congestionScore: 85,
      waypoints: [
        {
          lat: MOCK_VENUE.lat + 0.001,
          lng: MOCK_VENUE.lng,
          label: "Gate A - North",
          type: "gate",
        },
        {
          lat: MOCK_VENUE.lat,
          lng: MOCK_VENUE.lng,
          label: "Accessible Ramp",
          type: "facility",
        },
      ],
      considerations: [
        "Wheelchair accessible throughout",
        "Low crowd density",
        "Elevator access available",
      ],
    },
    {
      id: "route-fast",
      name: "Fastest Route via Gate D",
      distanceMeters: 320,
      estimatedMinutes: 5,
      accessibilityScore: 70,
      congestionScore: 90,
      waypoints: [
        {
          lat: MOCK_VENUE.lat,
          lng: MOCK_VENUE.lng - 0.001,
          label: "Gate D - West",
          type: "gate",
        },
      ],
      considerations: ["Shortest walking distance", "Some stairs present"],
    },
  ];
}

export function getVolunteerTasks(): VolunteerTask[] {
  return [
    {
      id: "task-1",
      title: "Gate A Crowd Management",
      description: "Monitor entry flow and assist with accessibility routing",
      location: "Gate A - North Entrance",
      priority: "high",
      status: "in_progress",
      dueAt: "2026-07-08T14:00:00.000Z",
    },
    {
      id: "task-2",
      title: "Fan Zone Assistance",
      description: "Help fans with navigation and multilingual support",
      location: "Fan Zone - Section 120",
      priority: "medium",
      status: "pending",
      dueAt: "2026-07-08T16:00:00.000Z",
    },
    {
      id: "task-3",
      title: "Sustainability Station",
      description: "Guide fans on recycling and refill stations",
      location: "Concourse Level 2",
      priority: "low",
      status: "pending",
      dueAt: "2026-07-08T18:00:00.000Z",
    },
  ];
}

export function getIncidents(): IncidentReport[] {
  return [
    {
      id: "inc-1",
      type: "Crowd Density",
      description: "Elevated crowd density near Gate C south entrance",
      location: "Gate C - South",
      severity: "medium",
      reportedBy: "Volunteer Team 7",
      status: "investigating",
      createdAt: "2026-07-08T12:45:00.000Z",
    },
    {
      id: "inc-2",
      type: "Accessibility",
      description: "Elevator maintenance in Section 112 - alternate route active",
      location: "Section 112",
      severity: "low",
      reportedBy: "Operations",
      status: "open",
      createdAt: "2026-07-08T12:30:00.000Z",
    },
  ];
}

export function getSustainabilityMetrics(): SustainabilityMetrics {
  return {
    reusableBottleUses: 12,
    publicTransportTrips: 2,
    walkingDistanceKm: 3.2,
    wasteSortedKg: 1.5,
    carbonSavedKg: 4.8,
    streakDays: 3,
  };
}

export function getCrowdHeatmapData(): Array<{
  section: string;
  density: number;
  lat: number;
  lng: number;
}> {
  const wobble = (minuteBucket() % 10) / 100;
  return [
    { section: "North Stand", density: Math.min(0.95, 0.45 + wobble), lat: 40.814, lng: -74.074 },
    { section: "East Stand", density: Math.min(0.95, 0.72 + wobble), lat: 40.812, lng: -74.072 },
    { section: "South Stand", density: Math.min(0.95, 0.85 + wobble), lat: 40.811, lng: -74.074 },
    { section: "West Stand", density: Math.max(0.2, 0.38 - wobble), lat: 40.812, lng: -74.076 },
    { section: "VIP Zone", density: Math.min(0.95, 0.55 + wobble / 2), lat: 40.813, lng: -74.073 },
  ];
}
