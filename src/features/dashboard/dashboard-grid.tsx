import {
  Activity,
  AlertTriangle,
  Bot,
  Bus,
  Cloud,
  HeartHandshake,
  Leaf,
  Siren,
  type LucideIcon,
} from "lucide-react";
import { getDashboardWidgets } from "@/services/stadium/data";
import { StatCard } from "@/components/shared/stat-card";
import type { WidgetType } from "@/types";

const WIDGET_ICONS: Record<WidgetType, LucideIcon> = {
  crowd: Activity,
  gate: Activity,
  transport: Bus,
  weather: Cloud,
  volunteer: HeartHandshake,
  emergency: Siren,
  carbon: Leaf,
  ai: Bot,
  queue: Activity,
  accessibility: AlertTriangle,
};

export function DashboardGrid() {
  const widgets = getDashboardWidgets();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {widgets.map((widget) => (
        <StatCard
          key={widget.id}
          title={widget.title}
          value={widget.value}
          icon={WIDGET_ICONS[widget.type]}
          trend={widget.trend}
          trendValue={widget.trendValue}
          status={widget.status}
        />
      ))}
    </div>
  );
}
