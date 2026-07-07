import { describe, expect, it } from "vitest";
import {
  formatDistance,
  formatWaitTime,
  getCongestionColor,
} from "@/lib/utils";

describe("formatWaitTime", () => {
  it("formats sub-minute waits", () => {
    expect(formatWaitTime(0)).toBe("Less than 1 min");
    expect(formatWaitTime(0.5)).toBe("Less than 1 min");
  });

  it("formats minute waits", () => {
    expect(formatWaitTime(1)).toBe("1 min");
    expect(formatWaitTime(15)).toBe("15 mins");
  });

  it("formats hour-long waits", () => {
    expect(formatWaitTime(60)).toBe("1h");
    expect(formatWaitTime(90)).toBe("1h 30m");
  });
});

describe("formatDistance", () => {
  it("formats meters for short distances", () => {
    expect(formatDistance(450)).toBe("450m");
    expect(formatDistance(50)).toBe("50m");
  });

  it("formats kilometers for long distances", () => {
    expect(formatDistance(1500)).toBe("1.5km");
    expect(formatDistance(10000)).toBe("10.0km");
  });
});

describe("getCongestionColor", () => {
  it("returns correct color classes for each level", () => {
    expect(getCongestionColor("low")).toContain("green");
    expect(getCongestionColor("moderate")).toContain("yellow");
    expect(getCongestionColor("high")).toContain("orange");
    expect(getCongestionColor("critical")).toContain("red");
  });
});
