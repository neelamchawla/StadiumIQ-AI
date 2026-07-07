import { describe, expect, it } from "vitest";
import { chatRequestSchema } from "@/schemas";

describe("chatRequestSchema", () => {
  it("accepts a valid chat request", () => {
    const result = chatRequestSchema.safeParse({
      message: "Which gate has the shortest wait?",
      language: "en",
      feature: "crowd_prediction",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toBe("Which gate has the shortest wait?");
      expect(result.data.language).toBe("en");
      expect(result.data.feature).toBe("crowd_prediction");
    }
  });

  it("applies default values", () => {
    const result = chatRequestSchema.safeParse({ message: "Hello" });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.language).toBe("en");
      expect(result.data.feature).toBe("assistant");
    }
  });

  it("rejects empty messages", () => {
    const result = chatRequestSchema.safeParse({ message: "" });
    expect(result.success).toBe(false);
  });

  it("rejects messages exceeding max length", () => {
    const result = chatRequestSchema.safeParse({ message: "a".repeat(2001) });
    expect(result.success).toBe(false);
  });

  it("rejects invalid language codes", () => {
    const result = chatRequestSchema.safeParse({
      message: "Hello",
      language: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional conversationId as UUID", () => {
    const result = chatRequestSchema.safeParse({
      message: "Hello",
      conversationId: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid conversationId", () => {
    const result = chatRequestSchema.safeParse({
      message: "Hello",
      conversationId: "not-a-uuid",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional context object", () => {
    const result = chatRequestSchema.safeParse({
      message: "Route to Section 112",
      context: { venueId: "metlife-stadium", section: "112" },
    });
    expect(result.success).toBe(true);
  });
});
