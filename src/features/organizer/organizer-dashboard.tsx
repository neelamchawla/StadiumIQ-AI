"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Bot, Loader2, Map } from "lucide-react";
import { getCrowdHeatmapData, getIncidents } from "@/services/stadium/data";
import { askStadiumAI } from "@/services/ai";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SEVERITY_VARIANTS = {
  low: "secondary" as const,
  medium: "warning" as const,
  high: "danger" as const,
  critical: "danger" as const,
};

const STATUS_COLORS = {
  open: "bg-yellow-500/10 text-yellow-600",
  investigating: "bg-blue-500/10 text-blue-600",
  resolved: "bg-green-500/10 text-green-600",
};

export function OrganizerDashboard() {
  const incidents = useMemo(() => getIncidents(), []);
  const heatmapData = useMemo(() => getCrowdHeatmapData(), []);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const isFetchingRef = useRef(false);

  const loadSummary = useCallback(async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoadingSummary(true);
    try {
      const response = await askStadiumAI({
        feature: "organizer",
        message: "Provide an operational summary of current stadium status.",
        context: {
          incidents: incidents.length,
          heatmap: heatmapData,
        },
      });
      setAiSummary(response.message);
    } catch {
      setAiSummary("Unable to generate AI summary at this time.");
    } finally {
      setIsLoadingSummary(false);
      isFetchingRef.current = false;
    }
  }, [heatmapData, incidents.length]);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>AI Operations Summary</CardTitle>
                <CardDescription>Real-time intelligence briefing</CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadSummary()}
              disabled={isLoadingSummary}
              aria-busy={isLoadingSummary}
            >
              {isLoadingSummary ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span className="sr-only">Refreshing summary</span>
                </>
              ) : (
                "Refresh"
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingSummary && !aiSummary ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating summary...
            </div>
          ) : (
            <p className="text-sm leading-relaxed">{aiSummary}</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Active Incidents
            </CardTitle>
            <CardDescription>{incidents.length} incidents requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className="rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/20"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{incident.type}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{incident.description}</p>
                  </div>
                  <Badge variant={SEVERITY_VARIANTS[incident.severity]}>{incident.severity}</Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{incident.location}</span>
                  <span className={cn("rounded-full px-2 py-0.5 font-medium", STATUS_COLORS[incident.status])}>
                    {incident.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              Crowd Density Heatmap
            </CardTitle>
            <CardDescription>Section-level occupancy visualization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-slate-900/10 to-slate-900/5 dark:from-slate-950/50 dark:to-slate-900/30">
              {heatmapData.map((section) => {
                const intensity = section.density;
                const size = 40 + intensity * 60;
                const positions: Record<string, { top: string; left: string }> = {
                  "North Stand": { top: "10%", left: "40%" },
                  "East Stand": { top: "40%", left: "75%" },
                  "South Stand": { top: "70%", left: "40%" },
                  "West Stand": { top: "40%", left: "10%" },
                  "VIP Zone": { top: "35%", left: "45%" },
                };
                const pos = positions[section.section] ?? { top: "50%", left: "50%" };

                return (
                  <div
                    key={section.section}
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all"
                    style={{
                      top: pos.top,
                      left: pos.left,
                      width: size,
                      height: size,
                      backgroundColor: `rgba(228, 0, 43, ${intensity * 0.7})`,
                      boxShadow: `0 0 ${intensity * 30}px rgba(228, 0, 43, ${intensity * 0.5})`,
                    }}
                    title={`${section.section}: ${Math.round(intensity * 100)}%`}
                  />
                );
              })}
              <div className="absolute bottom-3 left-3 rounded-lg bg-background/80 px-3 py-2 text-xs backdrop-blur-sm">
                <p className="font-medium">Density Heatmap</p>
                <p className="text-muted-foreground">Red = higher density</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {heatmapData.map((section) => (
                <div key={section.section} className="flex items-center justify-between text-sm">
                  <span>{section.section}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-red-500"
                        style={{ width: `${section.density * 100}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-muted-foreground">
                      {Math.round(section.density * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
