import type { Metadata } from "next";
import { VolunteerDashboard } from "@/features/volunteer/volunteer-dashboard";

export const metadata: Metadata = {
  title: "Volunteer",
  description: "Volunteer task management and incident reporting for match day operations.",
};

export default function VolunteerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <VolunteerDashboard />
    </div>
  );
}
