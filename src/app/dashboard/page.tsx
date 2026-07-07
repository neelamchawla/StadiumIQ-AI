import type { Metadata } from "next";
import { DashboardGrid } from "@/features/dashboard/dashboard-grid";
import { CrowdChart } from "@/features/dashboard/crowd-chart";
import { WeatherWidget } from "@/features/dashboard/weather-widget";
import { SustainabilityTracker } from "@/features/sustainability/sustainability-tracker";

export const metadata: Metadata = {
  title: "Live Dashboard",
  description: "Real-time stadium intelligence dashboard with crowd, weather, and sustainability metrics.",
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold">
          Live Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Real-time operational intelligence for match day
        </p>
      </div>

      <DashboardGrid />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <CrowdChart />
        <WeatherWidget />
      </div>

      <div className="mt-8">
        <SustainabilityTracker />
      </div>
    </div>
  );
}
