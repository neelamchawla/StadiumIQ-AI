import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  status?: "normal" | "warning" | "critical";
  className?: string;
}

const statusStyles = {
  normal: "border-border",
  warning: "border-yellow-500/50 bg-yellow-500/5",
  critical: "border-red-500/50 bg-red-500/5",
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const trendColors = {
  up: "text-green-800 dark:text-green-300",
  down: "text-red-800 dark:text-red-300",
  stable: "text-muted-foreground",
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  status = "normal",
  className,
}: StatCardProps) {
  const TrendIcon = trend ? trendIcons[trend] : null;

  return (
    <Card className={cn(statusStyles[status], className)} role="region" aria-label={title}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && (
          <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        )}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tabular-nums">{value}</p>
        {(description || trend) && (
          <div className="mt-1 flex items-center gap-2">
            {trend && TrendIcon && (
              <span className={cn("flex items-center gap-1 text-xs", trendColors[trend])}>
                <TrendIcon className="h-3 w-3" aria-hidden="true" />
                {trendValue && <span>{trendValue}</span>}
              </span>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
