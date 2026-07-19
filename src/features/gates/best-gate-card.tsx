"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Accessibility, ArrowRight, MapPin, Sparkles } from "lucide-react";
import { recommendBestGate } from "@/services/stadium/recommendations";
import { CongestionBadge } from "@/components/shared/congestion-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatWaitTime } from "@/lib/utils";

interface BestGateCardProps {
  compact?: boolean;
}

export function BestGateCard({ compact = false }: BestGateCardProps) {
  const [requireAccessible, setRequireAccessible] = useState(false);
  const recommendation = useMemo(
    () => recommendBestGate({ requireAccessible }),
    [requireAccessible],
  );

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader className={compact ? "pb-3" : undefined}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
              Get Me In — Best Gate Now
            </CardTitle>
            <CardDescription>
              Context-aware entrance recommendation from live simulated gate data
            </CardDescription>
          </div>
          <CongestionBadge level={recommendation.congestionLevel} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/60 p-3">
          <div className="space-y-0.5">
            <Label htmlFor="accessible-gate" className="text-sm font-medium">
              Accessible entrance required
            </Label>
            <p className="text-xs text-muted-foreground">Prioritize ramps, elevators, and open accessible gates</p>
          </div>
          <Switch
            id="accessible-gate"
            checked={requireAccessible}
            onCheckedChange={setRequireAccessible}
          />
        </div>

        <div className="rounded-xl border border-border/50 bg-background/80 p-4" aria-live="polite">
          <p className="text-2xl font-bold tracking-tight">{recommendation.gate.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{recommendation.reason}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              Wait {formatWaitTime(recommendation.predictedWaitMinutes)}
            </span>
            {recommendation.requireAccessible && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                <Accessibility className="h-3.5 w-3.5" aria-hidden="true" />
                Accessible route
              </span>
            )}
          </div>
          {recommendation.route && (
            <p className="mt-3 text-xs text-muted-foreground">
              Suggested path: {recommendation.route.name} · ~{recommendation.route.estimatedMinutes} min walk
            </p>
          )}
        </div>

        {!compact && recommendation.alternatives.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Alternatives
            </p>
            <ul className="space-y-1 text-sm">
              {recommendation.alternatives.map((gate) => (
                <li key={gate.id} className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2">
                  <span>{gate.name}</span>
                  <span className="text-muted-foreground">{formatWaitTime(gate.waitTimeMinutes)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild className="flex-1">
            <Link href="/stadium">
              Open Stadium Map
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/chat">Ask AI for directions</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
