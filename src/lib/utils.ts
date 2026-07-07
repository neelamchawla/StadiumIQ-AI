import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind CSS classes with conflict resolution */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a number as a percentage */
export function formatPercent(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/** Format wait time in human-readable form */
export function formatWaitTime(minutes: number): string {
  if (minutes < 1) return "Less than 1 min";
  if (minutes === 1) return "1 min";
  if (minutes < 60) return `${minutes} mins`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/** Format distance in human-readable form */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

/** Get congestion level color class */
export function getCongestionColor(
  level: "low" | "moderate" | "high" | "critical",
): string {
  const colors = {
    low: "text-green-500 bg-green-500/10",
    moderate: "text-yellow-500 bg-yellow-500/10",
    high: "text-orange-500 bg-orange-500/10",
    critical: "text-red-500 bg-red-500/10",
  };
  return colors[level];
}

/** Generate a unique ID */
export function generateId(): string {
  return crypto.randomUUID();
}

/** Delay utility for retry logic */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Safe JSON parse with fallback */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

/** Check if code is running on client */
export function isClient(): boolean {
  return typeof window !== "undefined";
}

/** Check if user prefers reduced motion */
export function prefersReducedMotion(): boolean {
  if (!isClient()) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
