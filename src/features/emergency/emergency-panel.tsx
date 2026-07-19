"use client";

import { useMemo, useState } from "react";
import {
  Baby,
  CloudLightning,
  Flame,
  HeartPulse,
  HelpCircle,
  Loader2,
  MapPin,
  ShieldAlert,
  Siren,
} from "lucide-react";
import { EMERGENCY_TYPES } from "@/constants";
import { askStadiumAI } from "@/services/ai";
import { getHelpCenters } from "@/services/stadium/data";
import { loadPreferences } from "@/lib/preferences";
import type { EmergencyType } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatDistance } from "@/lib/utils";

const EMERGENCY_ICONS: Record<string, React.ElementType> = {
  HeartPulse,
  ShieldAlert,
  Baby,
  Flame,
  HelpCircle,
  CloudLightning,
};

const PRIORITY_VARIANTS = {
  critical: "danger" as const,
  high: "warning" as const,
  medium: "secondary" as const,
};

const TYPE_TO_HELP: Record<EmergencyType, HelpCenterFilter> = {
  medical: "medical",
  security: "police",
  lost_child: "lost_found",
  fire: "exit",
  general: "info",
  weather: "info",
};

type HelpCenterFilter = "medical" | "police" | "info" | "lost_found" | "accessibility" | "exit";

export function EmergencyPanel() {
  const [selectedType, setSelectedType] = useState<EmergencyType | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const helpCenters = useMemo(() => getHelpCenters(), []);

  const nearestCenters = useMemo(() => {
    const preferred = selectedType ? TYPE_TO_HELP[selectedType] : null;
    return [...helpCenters]
      .sort((a, b) => {
        if (preferred) {
          const aMatch = a.type === preferred ? 0 : 1;
          const bMatch = b.type === preferred ? 0 : 1;
          if (aMatch !== bMatch) return aMatch - bMatch;
        }
        return a.distanceMeters - b.distanceMeters;
      })
      .slice(0, 3);
  }, [helpCenters, selectedType]);

  const handleEmergency = async (type: EmergencyType) => {
    setSelectedType(type);
    setIsLoading(true);
    setResponse(null);

    try {
      const prefs = loadPreferences();
      const emergency = EMERGENCY_TYPES.find((e) => e.id === type);
      const result = await askStadiumAI({
        feature: "emergency",
        message: `Emergency type: ${emergency?.label}. Provide immediate guidance with nearest help points.`,
        language: prefs.language,
        context: {
          emergencyType: type,
          role: prefs.role,
          language: prefs.language,
          includeStadiumData: true,
        },
      });
      setResponse(result.message);
    } catch {
      setResponse("Unable to reach emergency AI. Please contact stadium staff immediately.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <Siren className="h-5 w-5 text-destructive" aria-hidden="true" />
            </div>
            <div>
              <CardTitle>Emergency Assistance</CardTitle>
              <CardDescription>
                Select your emergency type for immediate AI-guided response
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="group" aria-label="Emergency types">
            {EMERGENCY_TYPES.map((emergency) => {
              const Icon = EMERGENCY_ICONS[emergency.icon] ?? HelpCircle;
              const isSelected = selectedType === emergency.id;

              return (
                <Button
                  key={emergency.id}
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "h-auto flex-col gap-2 p-4",
                    emergency.priority === "critical" && !isSelected && "border-destructive/30",
                  )}
                  onClick={() => void handleEmergency(emergency.id as EmergencyType)}
                  disabled={isLoading}
                  aria-pressed={isSelected}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                  <span className="text-sm font-medium">{emergency.label}</span>
                  <Badge variant={PRIORITY_VARIANTS[emergency.priority]} className="text-[10px]">
                    {emergency.priority}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedType && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nearest Help Centers</CardTitle>
            <CardDescription>Prioritized for your selected emergency type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {nearestCenters.map((center) => (
              <div
                key={center.id}
                className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{center.name}</p>
                  <p className="text-xs capitalize text-muted-foreground">{center.type.replace("_", " ")}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {formatDistance(center.distanceMeters)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {(isLoading || response) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Emergency Guidance</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-3 text-muted-foreground" aria-live="assertive">
                <Loader2 className="h-5 w-5 animate-spin text-destructive" aria-hidden="true" />
                <span>Generating emergency response...</span>
              </div>
            ) : (
              <div
                className="rounded-lg border border-destructive/20 bg-destructive/5 p-4"
                aria-live="assertive"
                role="status"
              >
                <p className="text-sm leading-relaxed">{response}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
