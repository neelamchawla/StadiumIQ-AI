import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "@/components/ui/badge";
import { cn, getCongestionColor } from "@/lib/utils";

/** Simple congestion badge using existing Badge component */
function CongestionBadge({
  level,
  label,
}: {
  level: "low" | "moderate" | "high" | "critical";
  label: string;
}) {
  return (
    <Badge className={cn(getCongestionColor(level))} data-testid="congestion-badge">
      {label}
    </Badge>
  );
}

describe("CongestionBadge", () => {
  it("renders the congestion label", () => {
    render(<CongestionBadge level="low" label="Low congestion" />);
    expect(screen.getByText("Low congestion")).toBeInTheDocument();
  });

  it("applies congestion color classes for high level", () => {
    render(<CongestionBadge level="high" label="High congestion" />);
    const badge = screen.getByTestId("congestion-badge");
    expect(badge.className).toContain("orange");
  });

  it("applies congestion color classes for critical level", () => {
    render(<CongestionBadge level="critical" label="Critical" />);
    const badge = screen.getByTestId("congestion-badge");
    expect(badge.className).toContain("red");
  });
});
