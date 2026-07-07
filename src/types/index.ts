/** Core application types for FIFA Stadium Intelligence AI */

export type UserRole = "fan" | "volunteer" | "organizer" | "staff" | "security";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  preferredLanguage: SupportedLanguage;
  accessibilityNeeds?: AccessibilityNeeds;
  sustainabilityScore?: number;
  createdAt: string;
  updatedAt: string;
}

export type SupportedLanguage =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "pt"
  | "ar"
  | "zh"
  | "ja"
  | "ko";

export interface AccessibilityNeeds {
  wheelchair: boolean;
  visualImpairment: boolean;
  hearingImpairment: boolean;
  mobilityAssistance: boolean;
  companionRequired: boolean;
}

export interface GateStatus {
  id: string;
  name: string;
  congestionLevel: CongestionLevel;
  waitTimeMinutes: number;
  capacity: number;
  currentOccupancy: number;
  isAccessible: boolean;
  status: "open" | "closed" | "restricted";
}

export type CongestionLevel = "low" | "moderate" | "high" | "critical";

export interface CrowdPrediction {
  gateId: string;
  gateName: string;
  predictedWaitMinutes: number;
  congestionLevel: CongestionLevel;
  confidence: number;
  explanation: string;
  recommendedAlternative?: string;
}

export interface RouteRecommendation {
  id: string;
  name: string;
  distanceMeters: number;
  estimatedMinutes: number;
  accessibilityScore: number;
  congestionScore: number;
  waypoints: RouteWaypoint[];
  considerations: string[];
}

export interface RouteWaypoint {
  lat: number;
  lng: number;
  label: string;
  type: "gate" | "facility" | "landmark" | "emergency";
}

export interface EmergencyResponse {
  type: EmergencyType;
  nearestHelpCenter: HelpCenter;
  emergencyExits: HelpCenter[];
  evacuationRoute: RouteRecommendation;
  instructions: string[];
  priority: "low" | "medium" | "high" | "critical";
}

export type EmergencyType =
  | "medical"
  | "security"
  | "lost_child"
  | "fire"
  | "general"
  | "weather";

export interface HelpCenter {
  id: string;
  name: string;
  type: "medical" | "police" | "info" | "lost_found" | "accessibility" | "exit";
  lat: number;
  lng: number;
  distanceMeters: number;
  waitTimeMinutes?: number;
}

export interface SustainabilityMetrics {
  reusableBottleUses: number;
  publicTransportTrips: number;
  walkingDistanceKm: number;
  wasteSortedKg: number;
  carbonSavedKg: number;
  streakDays: number;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: WidgetType;
  value: string | number;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  status?: "normal" | "warning" | "critical";
}

export type WidgetType =
  | "crowd"
  | "gate"
  | "transport"
  | "weather"
  | "volunteer"
  | "emergency"
  | "carbon"
  | "ai"
  | "queue"
  | "accessibility";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  metadata?: ChatMessageMetadata;
}

export interface ChatMessageMetadata {
  language?: SupportedLanguage;
  feature?: AIFeature;
  confidence?: number;
  sources?: string[];
}

export type AIFeature =
  | "assistant"
  | "crowd_prediction"
  | "route_recommendation"
  | "accessibility"
  | "emergency"
  | "sustainability"
  | "volunteer"
  | "organizer";

export interface AIResponse<T = unknown> {
  success: boolean;
  data?: T;
  message: string;
  confidence?: number;
  feature: AIFeature;
  timestamp: string;
}

export interface VolunteerTask {
  id: string;
  title: string;
  description: string;
  location: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed";
  assignedTo?: string;
  dueAt: string;
}

export interface IncidentReport {
  id: string;
  type: string;
  description: string;
  location: string;
  severity: "low" | "medium" | "high" | "critical";
  reportedBy: string;
  status: "open" | "investigating" | "resolved";
  createdAt: string;
}

export interface WeatherAlert {
  id: string;
  condition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  alertLevel: "none" | "advisory" | "warning" | "severe";
  message: string;
}

export interface StadiumVenue {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  lat: number;
  lng: number;
  gates: GateStatus[];
}

export interface ApiError {
  code: string;
  message: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
