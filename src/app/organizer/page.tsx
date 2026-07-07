import type { Metadata } from "next";
import { OrganizerDashboard } from "@/features/organizer/organizer-dashboard";

export const metadata: Metadata = {
  title: "Organizer",
  description: "AI-powered operational intelligence for stadium organizers and event managers.",
};

export default function OrganizerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold">
          Organizer Command Center
        </h1>
        <p className="mt-1 text-muted-foreground">
          AI-powered operational intelligence and incident management
        </p>
      </div>
      <OrganizerDashboard />
    </div>
  );
}
