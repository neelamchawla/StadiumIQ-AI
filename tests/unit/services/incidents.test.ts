import { beforeEach, describe, expect, it } from "vitest";
import { addIncident, listIncidents, resetIncidentStore } from "@/services/stadium/incidents";

describe("incident store", () => {
  beforeEach(() => {
    resetIncidentStore();
  });

  it("lists seed incidents by default", () => {
    const incidents = listIncidents();
    expect(incidents.length).toBeGreaterThanOrEqual(2);
  });

  it("prepends newly reported incidents", () => {
    const created = addIncident({
      id: "test-inc",
      type: "Crowd Density",
      description: "Test crowd surge near Gate C",
      location: "Gate C",
      severity: "high",
      reportedBy: "demo-volunteer",
      status: "open",
      createdAt: new Date().toISOString(),
    });

    const incidents = listIncidents();
    expect(incidents[0]?.id).toBe(created.id);
  });
});
