import { getCongestionColor, cn } from "@/lib/utils";
import type { CongestionLevel } from "@/types";
import { Badge } from "@/components/ui/badge";

const CONGESTION_LABELS: Record<CongestionLevel, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
  critical: "Critical",
};

interface CongestionBadgeProps {
  level: CongestionLevel;
  showLabel?: boolean;
  className?: string;
}

export function CongestionBadge({ level, showLabel = true, className }: CongestionBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("border-transparent font-medium capitalize", getCongestionColor(level), className)}
      aria-label={`Congestion level: ${CONGESTION_LABELS[level]}`}
    >
      {showLabel ? CONGESTION_LABELS[level] : level}
    </Badge>
  );
}
