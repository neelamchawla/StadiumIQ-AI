import { z } from "zod";

export const supportedLanguagesSchema = z.enum([
  "en",
  "es",
  "fr",
  "de",
  "pt",
  "ar",
  "zh",
  "ja",
  "ko",
]);

export const userRoleSchema = z.enum([
  "fan",
  "volunteer",
  "organizer",
  "staff",
  "security",
]);

export const accessibilityNeedsSchema = z.object({
  wheelchair: z.boolean().default(false),
  visualImpairment: z.boolean().default(false),
  hearingImpairment: z.boolean().default(false),
  mobilityAssistance: z.boolean().default(false),
  companionRequired: z.boolean().default(false),
});

export const chatRequestSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(2000, "Message too long"),
  conversationId: z.string().uuid().optional(),
  language: supportedLanguagesSchema.default("en"),
  feature: z
    .enum([
      "assistant",
      "crowd_prediction",
      "route_recommendation",
      "accessibility",
      "emergency",
      "sustainability",
      "volunteer",
      "organizer",
    ])
    .default("assistant"),
  context: z.record(z.unknown()).optional(),
});

export const crowdPredictionRequestSchema = z.object({
  venueId: z.string().min(1),
  preferredGate: z.string().optional(),
  accessibilityRequired: z.boolean().default(false),
});

export const routeRequestSchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
  accessibilityNeeds: accessibilityNeedsSchema.optional(),
  avoidCrowds: z.boolean().default(true),
  includeWeather: z.boolean().default(true),
});

export const emergencyRequestSchema = z.object({
  type: z.enum(["medical", "security", "lost_child", "fire", "general", "weather"]),
  message: z.string().min(1).max(1000),
  location: z.string().optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
});

export const sustainabilityLogSchema = z.object({
  action: z.enum([
    "reusable_bottle",
    "public_transport",
    "walking",
    "waste_sorting",
    "carpool",
  ]),
  value: z.number().positive().optional(),
  notes: z.string().max(500).optional(),
});

export const incidentReportSchema = z.object({
  type: z.string().min(1).max(100),
  description: z.string().min(10).max(2000),
  location: z.string().min(1).max(200),
  severity: z.enum(["low", "medium", "high", "critical"]),
});

export const profileUpdateSchema = z.object({
  displayName: z.string().min(2).max(100).optional(),
  preferredLanguage: supportedLanguagesSchema.optional(),
  accessibilityNeeds: accessibilityNeedsSchema.optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = loginSchema.extend({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  role: userRoleSchema.default("fan"),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type CrowdPredictionRequest = z.infer<typeof crowdPredictionRequestSchema>;
export type RouteRequest = z.infer<typeof routeRequestSchema>;
export type EmergencyRequest = z.infer<typeof emergencyRequestSchema>;
export type SustainabilityLog = z.infer<typeof sustainabilityLogSchema>;
export type IncidentReportInput = z.infer<typeof incidentReportSchema>;
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

/** JSON schema for structured AI crowd prediction output */
export const crowdPredictionOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      gateId: z.string(),
      gateName: z.string(),
      predictedWaitMinutes: z.number(),
      congestionLevel: z.enum(["low", "moderate", "high", "critical"]),
      confidence: z.number().min(0).max(1),
      explanation: z.string(),
      recommendedAlternative: z.string().optional(),
    }),
  ),
  bestGate: z.string(),
  summary: z.string(),
});

export type CrowdPredictionOutput = z.infer<typeof crowdPredictionOutputSchema>;
