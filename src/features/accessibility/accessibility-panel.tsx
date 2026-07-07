"use client";

import { useState } from "react";
import { Loader2, Mic, Route, Volume2 } from "lucide-react";
import { askStadiumAI } from "@/services/ai";
import type { AccessibilityNeeds } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toaster";

const NEEDS_LABELS: { key: keyof AccessibilityNeeds; label: string; description: string }[] = [
  { key: "wheelchair", label: "Wheelchair Access", description: "Ramp and elevator routes" },
  { key: "visualImpairment", label: "Visual Impairment", description: "Audio guidance and tactile paths" },
  { key: "hearingImpairment", label: "Hearing Impairment", description: "Visual alerts and captions" },
  { key: "mobilityAssistance", label: "Mobility Assistance", description: "Rest areas and shuttle service" },
  { key: "companionRequired", label: "Companion Required", description: "Companion seating and support" },
];

export function AccessibilityPanel() {
  const [needs, setNeeds] = useState<AccessibilityNeeds>({
    wheelchair: false,
    visualImpairment: false,
    hearingImpairment: false,
    mobilityAssistance: false,
    companionRequired: false,
  });
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const toggleNeed = (key: keyof AccessibilityNeeds) => {
    setNeeds((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGetRoute = async () => {
    setIsLoading(true);
    try {
      const response = await askStadiumAI({
        feature: "accessibility",
        message: "Recommend the best accessible route based on my needs.",
        context: { accessibilityNeeds: needs },
      });
      setAiResponse(response.message);
    } catch {
      toast({ title: "Error", description: "Could not get route recommendation.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    toast({ title: "Voice Input", description: "Voice recognition placeholder — speak your request." });
    setTimeout(() => setIsListening(false), 2000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Needs</CardTitle>
          <CardDescription>
            Tell us your requirements for personalized routing and assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {NEEDS_LABELS.map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between rounded-lg border border-border/50 p-4">
              <div className="space-y-0.5">
                <Label htmlFor={key} className="text-base">
                  {label}
                </Label>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <Switch id={key} checked={needs[key]} onCheckedChange={() => toggleNeed(key)} />
            </div>
          ))}

          <Separator />

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => void handleGetRoute()} disabled={isLoading} className="flex-1">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Route className="mr-2 h-4 w-4" />
              )}
              Get Accessible Route
            </Button>
            <Button
              variant="outline"
              onClick={handleVoiceInput}
              disabled={isListening}
              className="flex-1"
            >
              {isListening ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Mic className="mr-2 h-4 w-4" />
              )}
              {isListening ? "Listening..." : "Voice Input"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Guidance</CardTitle>
          <CardDescription>Personalized accessibility recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          {aiResponse ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 text-sm leading-relaxed">{aiResponse}</div>
              <Button variant="outline" size="sm">
                <Volume2 className="mr-2 h-4 w-4" />
                Read Aloud (Placeholder)
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Route className="mb-4 h-12 w-12 opacity-30" />
              <p className="text-sm">Configure your needs and request an accessible route</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
