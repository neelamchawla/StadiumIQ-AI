import {
  Accessibility,
  Building2,
  HeartHandshake,
  Home,
  LayoutDashboard,
  Map,
  MessageSquare,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export const NAV_ICON_MAP: Record<string, LucideIcon> = {
  Home,
  Sparkles,
  MessageSquare,
  Map,
  LayoutDashboard,
  Accessibility,
  HeartHandshake,
  Building2,
};

export function getNavIcon(iconName: string): LucideIcon {
  return NAV_ICON_MAP[iconName] ?? Home;
}
