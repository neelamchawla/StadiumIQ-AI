"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { MOCK_VENUE } from "@/constants";
import { getGateStatuses } from "@/services/stadium/data";
import { CongestionBadge } from "@/components/shared/congestion-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const GATE_POSITIONS: Record<string, { top: string; left: string }> = {
  "gate-a": { top: "8%", left: "50%" },
  "gate-b": { top: "50%", left: "92%" },
  "gate-c": { top: "88%", left: "50%" },
  "gate-d": { top: "50%", left: "8%" },
  "gate-vip": { top: "25%", left: "75%" },
};

export function StadiumMap() {
  const gates = getGateStatuses();
  const [selectedGate, setSelectedGate] = useState<string | null>(null);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{MOCK_VENUE.name}</CardTitle>
        <CardDescription>
          {MOCK_VENUE.city}, {MOCK_VENUE.country} · Capacity {MOCK_VENUE.capacity.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-emerald-900/20 via-slate-900/10 to-blue-900/20 dark:from-emerald-950/40 dark:via-slate-950/30 dark:to-blue-950/40">
          {/* Field */}
          <div className="absolute inset-[18%] rounded-[50%] border-2 border-emerald-500/30 bg-emerald-500/10">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-emerald-500/20" />
            <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-500/20" />
          </div>

          {/* Stands */}
          <div className="absolute inset-2 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent" />

          {/* Gate markers */}
          {gates.map((gate) => {
            const pos = GATE_POSITIONS[gate.id];
            if (!pos) return null;
            const isSelected = selectedGate === gate.id;

            return (
              <button
                key={gate.id}
                type="button"
                className={cn(
                  "absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110",
                  isSelected && "scale-110",
                )}
                style={{ top: pos.top, left: pos.left }}
                onClick={() => setSelectedGate(isSelected ? null : gate.id)}
                aria-label={`${gate.name}, ${gate.congestionLevel} congestion`}
              >
                <div
                  className={cn(
                    "flex flex-col items-center gap-1",
                    gate.congestionLevel === "high" && "animate-pulse",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 shadow-lg",
                      gate.congestionLevel === "low" && "border-green-500 bg-green-500/20",
                      gate.congestionLevel === "moderate" && "border-yellow-500 bg-yellow-500/20",
                      gate.congestionLevel === "high" && "border-orange-500 bg-orange-500/20",
                      isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                    )}
                  >
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="rounded-md bg-background/90 px-1.5 py-0.5 text-[10px] font-medium shadow-sm backdrop-blur-sm">
                    {gate.name.split(" - ")[0]}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-3 left-3 rounded-lg bg-background/80 px-3 py-2 text-xs backdrop-blur-sm">
            <p className="font-medium">Interactive Map</p>
            <p className="text-muted-foreground">Tap gates for details</p>
          </div>
        </div>

        {selectedGate && (
          <div className="mt-4 rounded-lg border border-border/50 bg-muted/30 p-4">
            {(() => {
              const gate = gates.find((g) => g.id === selectedGate);
              if (!gate) return null;
              return (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{gate.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Wait: {gate.waitTimeMinutes} min ·{" "}
                      {Math.round((gate.currentOccupancy / gate.capacity) * 100)}% full
                    </p>
                  </div>
                  <CongestionBadge level={gate.congestionLevel} />
                </div>
              );
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
