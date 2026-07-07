"use client";

import { useState } from "react";
import {
  Baby,
  CloudLightning,
  Flame,
  HeartPulse,
  HelpCircle,
  Loader2,
  ShieldAlert,
  Siren,
} from "lucide-react";
import { EMERGENCY_TYPES } from "@/constants";
import { askStadiumAI } from "@/services/ai";
import type { EmergencyType } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

export function EmergencyPanel() {
  const [selectedType, setSelectedType] = useState<EmergencyType | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmergency = async (type: EmergencyType) => {
    setSelectedType(type);
    setIsLoading(true);
    setResponse(null);

    try {
      const emergency = EMERGENCY_TYPES.find((e) => e.id === type);
      const result = await askStadiumAI({
        feature: "emergency",
        message: `Emergency type: ${emergency?.label}. Provide immediate guidance.`,
        context: { emergencyType: type },
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
              <Siren className="h-5 w-5 text-destructive" />
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                >
                  <Icon className="h-6 w-6" />
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

      {(isLoading || response) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Emergency Guidance</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-destructive" />
                <span>Generating emergency response...</span>
              </div>
            ) : (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <p className="text-sm leading-relaxed">{response}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
