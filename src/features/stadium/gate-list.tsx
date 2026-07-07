import { Accessibility, Clock, Users } from "lucide-react";
import { getGateStatuses } from "@/services/stadium/data";
import { CongestionBadge } from "@/components/shared/congestion-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatWaitTime } from "@/lib/utils";

export function GateList() {
  const gates = getGateStatuses();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gate Status</CardTitle>
        <CardDescription>Real-time congestion and wait times</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {gates.map((gate) => {
          const occupancyPct = Math.round((gate.currentOccupancy / gate.capacity) * 100);

          return (
            <div
              key={gate.id}
              className="flex items-center justify-between rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/30"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{gate.name}</p>
                  {gate.isAccessible && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <Accessibility className="h-3 w-3" />
                      Accessible
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatWaitTime(gate.waitTimeMinutes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {occupancyPct}% capacity
                  </span>
                </div>
              </div>
              <CongestionBadge level={gate.congestionLevel} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
