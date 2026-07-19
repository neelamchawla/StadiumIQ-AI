"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Bot, Loader2, Map } from "lucide-react";
import { getCrowdHeatmapData } from "@/services/stadium/data";
import { askStadiumAI } from "@/services/ai";
import { fetchIncidents } from "@/app/actions/incident";
import { loadPreferences } from "@/lib/preferences";
import type { IncidentReport } from "@/types";
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
  open: "bg-amber-100 text-amber-950 dark:bg-amber-500/20 dark:text-amber-200",
  investigating: "bg-blue-100 text-blue-950 dark:bg-blue-500/20 dark:text-blue-200",
  resolved: "bg-green-100 text-green-900 dark:bg-green-500/20 dark:text-green-200",
};

export function OrganizerDashboard() {
  const heatmapData = useMemo(() => getCrowdHeatmapData(), []);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const isFetchingRef = useRef(false);

  const refreshIncidents = useCallback(async () => {
    const next = await fetchIncidents();
    setIncidents(next);
    return next;
  }, []);

  const loadSummary = useCallback(async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoadingSummary(true);
    try {
      const currentIncidents = await refreshIncidents();
      const prefs = loadPreferences();
      const response = await askStadiumAI({
        feature: "organizer",
        message: "Provide an operational summary of current stadium status and open incidents.",
        language: prefs.language,
        context: {
          role: "organizer",
          language: prefs.language,
          includeStadiumData: true,
        },
      });
      setAiSummary(
        `${response.message}\n\nOpen incidents tracked: ${currentIncidents.filter((i) => i.status !== "resolved").length}.`,
      );
    } catch {
      setAiSummary("Unable to generate AI summary at this time.");
    } finally {
      setIsLoadingSummary(false);
      isFetchingRef.current = false;
    }
  }, [refreshIncidents]);

  useEffect(() => {
    void loadSummary();
    const timer = setInterval(() => {
      void refreshIncidents();
    }, 8000);
    return () => clearInterval(timer);
  }, [loadSummary, refreshIncidents]);

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Bot className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <CardTitle>AI Operations Summary</CardTitle>
                <CardDescription>Match-day intelligence briefing (simulated venue data)</CardDescription>
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
            <div className="flex items-center gap-2 text-muted-foreground" aria-live="polite">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Generating summary...
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-sm leading-relaxed" aria-live="polite">
              {aiSummary}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" aria-hidden="true" />
              Active Incidents
            </CardTitle>
            <CardDescription>
              {incidents.length} incidents · volunteer reports appear here in near real time
            </CardDescription>
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
                  <span>
                    {incident.location} · {incident.reportedBy}
                  </span>
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
              <Map className="h-5 w-5 text-primary" aria-hidden="true" />
              Crowd Density Heatmap
            </CardTitle>
            <CardDescription>Section-level occupancy visualization</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="relative aspect-square w-full overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-slate-900/10 to-slate-900/5 dark:from-slate-950/50 dark:to-slate-900/30"
              role="img"
              aria-label="Crowd density heatmap by stadium section"
            >
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
                <p className="text-muted-foreground">Larger / redder = higher density</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {heatmapData.map((section) => (
                <div key={section.section} className="flex items-center justify-between text-sm">
                  <span>{section.section}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-muted" aria-hidden="true">
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
