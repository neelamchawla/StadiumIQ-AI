import type { AIFeature, ChatMessage } from "@/types";
import { sanitizePromptInput } from "@/lib/sanitize";
import { FALLBACK_RESPONSES, SYSTEM_PROMPTS } from "./prompts";

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

function buildMessages(request: AIProviderRequest): string {
  const systemPrompt = SYSTEM_PROMPTS[request.feature];
  const sanitizedMessage = sanitizePromptInput(request.message);
  const history = (request.history ?? [])
    .slice(-6)
    .map((message) => `${message.role}: ${sanitizePromptInput(message.content)}`)
    .join("\n");

  const contextBlock = request.context
    ? `\nContext:\n${JSON.stringify(request.context)}`
    : "";

  const languageBlock = request.language
    ? `\nPreferred language: ${request.language}`
    : "";

  return `${systemPrompt}${languageBlock}${contextBlock}\n\nConversation:\n${history}\n\nUser: ${sanitizedMessage}`;
}

/** Mock provider used when Gemini isn't configured */
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
            {
              gateId: "gate-d",
              gateName: "Gate D - West",
              predictedWaitMinutes: 8,
              congestionLevel: "low",
              confidence: 0.88,
              explanation:
                "Gate D remains a strong alternative with accessible routes and moderate walking distance.",
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
        metadata: {
          helpCenters: [
            { name: "Medical Station A", type: "medical", distanceMeters: 120 },
            { name: "Security Post 3", type: "security", distanceMeters: 80 },
          ],
        },
      };
    }

    if (request.feature === "route_recommendation") {
      return {
        message:
          "Recommended route: Enter via Gate A, proceed to the accessible ramp near Section 112, and follow signage to your destination. Estimated walk time: 8 minutes with low congestion.",
        confidence: 0.87,
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

/** Gemini provider with graceful fallback */
export class GeminiAIProvider implements AIProvider {
  constructor(private readonly apiKey: string) {}

  async generate(request: AIProviderRequest): Promise<AIProviderResponse> {
    if (!this.apiKey) {
      return new MockAIProvider().generate(request);
    }

    const prompt = buildMessages(request);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature: request.feature,
          prompt,
        }),
      });

      if (!response.ok) {
        return new MockAIProvider().generate(request);
      }

      const payload = (await response.json()) as AIProviderResponse;
      return payload;
    } catch {
      return new MockAIProvider().generate(request);
    }
  }
}

export function createAIProvider(apiKey = process.env.GEMINI_API_KEY ?? ""): AIProvider {
  return new GeminiAIProvider(apiKey);
}
