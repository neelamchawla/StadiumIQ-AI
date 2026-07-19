import type { AIFeature, ChatMessage } from "@/types";
import { FALLBACK_RESPONSES } from "./prompts";

export interface AIProviderRequest {
  feature: AIFeature;
  message: string;
  history?: ChatMessage[];
  language?: string;
  context?: Record<string, unknown>;
}

export interface AIProviderResponse {
  message: string;
  confidence?: number;
  metadata?: Record<string, unknown>;
}

export interface AIProvider {
  generate(request: AIProviderRequest): Promise<AIProviderResponse>;
}

/**
 * Deterministic mock provider for unit tests and offline demos.
 * Production UI uses sendChatMessage / /api/ai/chat instead.
 */
export class MockAIProvider implements AIProvider {
  async generate(request: AIProviderRequest): Promise<AIProviderResponse> {
    const message = request.message.toLowerCase();

    if (request.feature === "crowd_prediction") {
      return {
        message: JSON.stringify({
          recommendations: [
            {
              gateId: "gate-a",
              gateName: "Gate A - North",
              predictedWaitMinutes: 5,
              congestionLevel: "low",
              confidence: 0.92,
              explanation:
                "Gate A currently has the lowest congestion and accessible entry options.",
              recommendedAlternative: "Gate D - West",
            },
          ],
          bestGate: "Gate A - North",
          summary:
            "Gate A is currently the least crowded entrance with the shortest predicted wait.",
        }),
        confidence: 0.9,
      };
    }

    if (request.feature === "emergency") {
      return {
        message:
          "Stay calm. Proceed to the nearest marked help point or medical station. If this is a medical emergency, alert stadium staff immediately and follow evacuation signage if instructed.",
        confidence: 0.95,
      };
    }

    if (message.includes("gate") || message.includes("crowd")) {
      return {
        message:
          "Gate A - North currently has the lowest congestion with an estimated wait time of about 5 minutes.",
        confidence: 0.84,
      };
    }

    return {
      message: FALLBACK_RESPONSES[request.feature],
      confidence: 0.75,
    };
  }
}

export function createAIProvider(): AIProvider {
  return new MockAIProvider();
}
