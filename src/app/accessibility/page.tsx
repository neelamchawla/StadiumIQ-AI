import type { Metadata } from "next";
import { AccessibilityPanel } from "@/features/accessibility/accessibility-panel";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Personalized accessibility routing and voice-enabled stadium guidance.",
};

export default function AccessibilityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold">
          Accessibility Assistant
        </h1>
        <p className="mt-1 text-muted-foreground">
          Personalized routes and assistance for all accessibility needs
        </p>
      </div>
      <AccessibilityPanel />
    </div>
  );
}
