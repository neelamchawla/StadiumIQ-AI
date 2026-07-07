import type { Metadata } from "next";
import { StadiumMap } from "@/features/stadium/stadium-map";
import { GateList } from "@/features/stadium/gate-list";
import { EmergencyPanel } from "@/features/emergency/emergency-panel";

export const metadata: Metadata = {
  title: "Stadium Map",
  description: "Interactive stadium map with real-time gate congestion and emergency assistance.",
};

export default function StadiumPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold">
          Stadium Map
        </h1>
        <p className="mt-1 text-muted-foreground">
          Interactive venue map with live gate status and emergency support
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <StadiumMap />
        <GateList />
      </div>

      <div className="mt-8">
        <EmergencyPanel />
      </div>
    </div>
  );
}
