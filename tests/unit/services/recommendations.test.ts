import { describe, expect, it } from "vitest";
import { recommendBestGate } from "@/services/stadium/recommendations";

describe("recommendBestGate", () => {
  it("returns an open gate recommendation", () => {
    const result = recommendBestGate();
    expect(result.gate.status).toBe("open");
    expect(result.predictedWaitMinutes).toBeGreaterThan(0);
    expect(result.reason).toContain(result.gate.name);
  });

  it("prioritizes accessible gates when required", () => {
    const result = recommendBestGate({ requireAccessible: true });
    expect(result.requireAccessible).toBe(true);
    expect(result.gate.isAccessible).toBe(true);
  });
});
