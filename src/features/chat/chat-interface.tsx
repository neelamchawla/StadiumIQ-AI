"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, Sparkles } from "lucide-react";
import { AI_FEATURES } from "@/constants";
import { askStadiumAI } from "@/services/ai";
import { loadPreferences } from "@/lib/preferences";
import type { AIFeature, ChatMessage } from "@/types";
import { generateId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to FIFA Stadium Intelligence AI! Ask me about the best gate, accessible routes, emergencies, or match-day operations. I use live simulated stadium context for recommendations.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [feature, setFeature] = useState<AIFeature>("assistant");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const prefs = loadPreferences();
    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
      metadata: { feature },
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await askStadiumAI({
        feature,
        message: trimmed,
        language: prefs.language,
        context: {
          role: prefs.role,
          language: prefs.language,
          accessibilityNeeds: prefs.accessibilityNeeds,
          includeStadiumData: true,
          requireAccessible:
            prefs.accessibilityNeeds.wheelchair || prefs.accessibilityNeeds.mobilityAssistance,
        },
      });

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: response.message,
        timestamp: new Date().toISOString(),
        metadata: { feature, confidence: response.confidence },
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [feature, input, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const selectedFeature = AI_FEATURES.find((f) => f.id === feature);

  return (
    <Card className="flex h-[calc(100vh-12rem)] flex-col overflow-hidden border-border/50 shadow-xl">
      <CardHeader className="border-b border-border/50 bg-muted/30 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fifa-blue to-fifa-green text-white">
              <Bot className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-lg">FIFA AI Assistant</CardTitle>
              <p className="text-sm text-muted-foreground">Context-aware stadium intelligence</p>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="ai-feature" className="sr-only">
              AI feature mode
            </Label>
            <Select value={feature} onValueChange={(v) => setFeature(v as AIFeature)}>
              <SelectTrigger id="ai-feature" className="w-full sm:w-[240px]" aria-label="Select AI feature">
                <Sparkles className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
                <SelectValue placeholder="Select feature" />
              </SelectTrigger>
              <SelectContent>
                {AI_FEATURES.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {selectedFeature && (
          <p className="text-xs text-muted-foreground">{selectedFeature.description}</p>
        )}
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden p-0">
        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto p-4"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          aria-label="Chat messages"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground",
                )}
              >
                <p className="sr-only">{msg.role === "user" ? "You said:" : "Assistant said:"}</p>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.metadata?.confidence ? (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {Math.round(msg.metadata.confidence * 100)}% confidence
                  </Badge>
                ) : null}
              </div>
            </div>
          ))}

          {isLoading && (
            <div ref={statusRef} className="flex items-center gap-2 text-sm text-muted-foreground" aria-live="assertive">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>AI is thinking...</span>
            </div>
          )}
        </div>

        <div className="border-t border-border/50 bg-muted/20 p-4">
          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor="chat-input" className="sr-only">
                Message the stadium assistant
              </Label>
              <Textarea
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about gates, routes, accessibility..."
                className="min-h-[52px] resize-none"
                disabled={isLoading}
                aria-label="Message the stadium assistant"
              />
            </div>
            <Button
              onClick={() => void handleSend()}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-[52px] w-[52px] shrink-0"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
