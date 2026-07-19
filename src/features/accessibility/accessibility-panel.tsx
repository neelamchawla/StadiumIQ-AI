"use client";

import { useEffect, useState } from "react";
import { Loader2, Mic, Route, Volume2 } from "lucide-react";
import { askStadiumAI } from "@/services/ai";
import { loadPreferences, updatePreferences } from "@/lib/preferences";
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

  useEffect(() => {
    const prefs = loadPreferences();
    setNeeds(prefs.accessibilityNeeds);
  }, []);

  const toggleNeed = (key: keyof AccessibilityNeeds) => {
    setNeeds((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      updatePreferences({ accessibilityNeeds: next });
      return next;
    });
  };

  const handleGetRoute = async () => {
    setIsLoading(true);
    try {
      const prefs = loadPreferences();
      updatePreferences({ accessibilityNeeds: needs });
      const response = await askStadiumAI({
        feature: "accessibility",
        message: "Recommend the best accessible route and entrance based on my needs.",
        language: prefs.language,
        context: {
          accessibilityNeeds: needs,
          requireAccessible: true,
          role: prefs.role,
          language: prefs.language,
          includeStadiumData: true,
        },
      });
      setAiResponse(response.message);
    } catch {
      toast({ title: "Error", description: "Could not get route recommendation.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      typeof window !== "undefined"
        ? (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ||
          (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition
        : undefined;

    if (!SpeechRecognition) {
      toast({
        title: "Voice unavailable",
        description: "Speech recognition is not supported in this browser. Use Get Accessible Route instead.",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = loadPreferences().language === "en" ? "en-US" : loadPreferences().language;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      setIsListening(false);
      toast({ title: "Voice error", description: "Could not capture speech. Try again.", variant: "destructive" });
    };
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) {
        void askStadiumAI({
          feature: "accessibility",
          message: transcript,
          context: { accessibilityNeeds: needs, requireAccessible: true },
        }).then((response) => setAiResponse(response.message));
      }
    };
    recognition.start();
  };

  const handleReadAloud = () => {
    if (!aiResponse || typeof window === "undefined" || !window.speechSynthesis) {
      toast({ title: "Read aloud unavailable", description: "Speech synthesis is not supported here." });
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(aiResponse);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Route className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              Get Accessible Route
            </Button>
            <Button
              variant="outline"
              onClick={handleVoiceInput}
              disabled={isListening}
              className="flex-1"
              aria-pressed={isListening}
            >
              {isListening ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Mic className="mr-2 h-4 w-4" aria-hidden="true" />
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
              <div className="rounded-lg bg-muted/50 p-4 text-sm leading-relaxed" aria-live="polite" role="status">
                {aiResponse}
              </div>
              <Button variant="outline" size="sm" onClick={handleReadAloud}>
                <Volume2 className="mr-2 h-4 w-4" aria-hidden="true" />
                Read Aloud
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Route className="mb-4 h-12 w-12 opacity-30" aria-hidden="true" />
              <p className="text-sm">Configure your needs and request an accessible route</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface SpeechRecognitionLike {
  lang: string;
  start: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: { results?: ArrayLike<ArrayLike<{ transcript?: string }>> }) => void) | null;
}
