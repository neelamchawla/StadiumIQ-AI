"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, Sparkles } from "lucide-react";
import { AI_FEATURES } from "@/constants";
import { askStadiumAI } from "@/services/ai";
import type { AIFeature, ChatMessage } from "@/types";
import { generateId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
        "Welcome to FIFA Stadium Intelligence AI! I'm your multilingual stadium guide. Ask me about gates, routes, accessibility, emergencies, or anything about the venue.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [feature, setFeature] = useState<AIFeature>("assistant");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streamingText]);

  const simulateStreaming = useCallback(async (text: string) => {
    setStreamingText("");
    const words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
      await new Promise((r) => setTimeout(r, 30));
      setStreamingText((prev) => (prev ? `${prev} ${words[i]}` : words[i]));
    }
    return text;
  }, []);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

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
        history: messages,
      });

      const fullText = response.message;
      await simulateStreaming(fullText);

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: fullText,
        timestamp: new Date().toISOString(),
        metadata: { feature, confidence: response.confidence },
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingText("");
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
      setStreamingText("");
    } finally {
      setIsLoading(false);
    }
  };

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
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">FIFA AI Assistant</CardTitle>
              <p className="text-sm text-muted-foreground">Powered by Stadium Intelligence</p>
            </div>
          </div>
          <Select value={feature} onValueChange={(v) => setFeature(v as AIFeature)}>
            <SelectTrigger className="w-full sm:w-[240px]">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
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
        {selectedFeature && (
          <p className="text-xs text-muted-foreground">{selectedFeature.description}</p>
        )}
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden p-0">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
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
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.metadata?.confidence && (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {Math.round(msg.metadata.confidence * 100)}% confidence
                  </Badge>
                )}
              </div>
            </div>
          ))}

          {isLoading && streamingText && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl bg-muted px-4 py-3 text-sm">
                <p className="whitespace-pre-wrap">{streamingText}</p>
                <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-primary" />
              </div>
            </div>
          )}

          {isLoading && !streamingText && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>AI is thinking...</span>
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-border/50 bg-muted/20 p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about gates, routes, accessibility..."
              className="min-h-[52px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={() => void handleSend()}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-[52px] w-[52px] shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
