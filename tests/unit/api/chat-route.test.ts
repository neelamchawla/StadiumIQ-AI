import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetRateLimitStore } from "@/lib/rate-limit";

vi.mock("@/services/ai/gemini.server", () => ({
  generateWithGemini: vi.fn(async () => ({
    message: "Gate A is currently best.",
    confidence: 0.9,
    source: "fallback",
  })),
}));

describe("POST /api/ai/chat", () => {
  beforeEach(() => {
    resetRateLimitStore();
    vi.resetModules();
  });

  it("returns 400 for invalid body", async () => {
    const { POST } = await import("@/app/api/ai/chat/route");
    const response = await POST(
      new Request("http://localhost/api/ai/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: "" }),
      }),
    );

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
  });

  it("returns success for a valid chat request", async () => {
    const { POST } = await import("@/app/api/ai/chat/route");
    const response = await POST(
      new Request("http://localhost/api/ai/chat", {
        method: "POST",
        headers: { "content-type": "application/json", "x-real-ip": "203.0.113.10" },
        body: JSON.stringify({
          message: "Which gate should I use?",
          feature: "crowd_prediction",
        }),
      }),
    );

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.message).toContain("Gate A");
  });
});
