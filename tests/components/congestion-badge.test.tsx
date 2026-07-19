import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CongestionBadge } from "@/components/shared/congestion-badge";

describe("CongestionBadge", () => {
  it("renders the congestion label", () => {
    render(<CongestionBadge level="low" />);
    expect(screen.getByText("Low")).toBeInTheDocument();
  });

  it("exposes an accessible congestion label", () => {
    render(<CongestionBadge level="high" />);
    expect(screen.getByLabelText("Congestion level: High")).toBeInTheDocument();
  });

  it("applies congestion color classes for critical level", () => {
    render(<CongestionBadge level="critical" />);
    const badge = screen.getByLabelText("Congestion level: Critical");
    expect(badge.className).toContain("red");
  });
});
