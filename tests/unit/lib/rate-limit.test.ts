import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkRateLimit, resetRateLimitStore } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    resetRateLimitStore();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    resetRateLimitStore();
  });

  it("allows requests within the limit", () => {
    const options = { limit: 3, windowMs: 60_000 };

    const first = checkRateLimit("user-1", options);
    const second = checkRateLimit("user-1", options);

    expect(first.success).toBe(true);
    expect(first.remaining).toBe(2);
    expect(second.success).toBe(true);
    expect(second.remaining).toBe(1);
  });

  it("blocks requests exceeding the limit", () => {
    const options = { limit: 2, windowMs: 60_000 };

    checkRateLimit("user-2", options);
    checkRateLimit("user-2", options);
    const blocked = checkRateLimit("user-2", options);

    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("resets after the window expires", () => {
    const options = { limit: 1, windowMs: 60_000 };

    checkRateLimit("user-3", options);
    const blocked = checkRateLimit("user-3", options);
    expect(blocked.success).toBe(false);

    vi.advanceTimersByTime(61_000);

    const afterReset = checkRateLimit("user-3", options);
    expect(afterReset.success).toBe(true);
    expect(afterReset.remaining).toBe(0);
  });

  it("tracks identifiers independently", () => {
    const options = { limit: 1, windowMs: 60_000 };

    const userA = checkRateLimit("user-a", options);
    const userB = checkRateLimit("user-b", options);

    expect(userA.success).toBe(true);
    expect(userB.success).toBe(true);
  });
});
