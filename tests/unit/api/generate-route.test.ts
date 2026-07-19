import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/ai/generate/route";

describe("POST /api/ai/generate", () => {
  it("is disabled and returns 410", async () => {
    const response = await POST();
    expect(response.status).toBe(410);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("ENDPOINT_REMOVED");
  });
});
