import type { Metadata } from "next";
import Link from "next/link";
import {
  Accessibility,
  Bot,
  Building2,
  HeartHandshake,
  Leaf,
  Route,
  Shield,
  Siren,
  Users,
} from "lucide-react";
import { AI_FEATURES } from "@/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Features",
  description: "Explore all AI-powered features of FIFA Stadium Intelligence platform.",
};

const FEATURE_ICONS: Record<string, React.ElementType> = {
  Bot,
  Users,
  Route,
  Accessibility,
  Shield,
  Siren,
  Leaf,
  HeartHandshake,
  Building2,
};

const FEATURE_LINKS: Record<string, string> = {
  assistant: "/chat",
  crowd_prediction: "/dashboard",
  route_recommendation: "/stadium",
  accessibility: "/accessibility",
  emergency: "/chat",
  sustainability: "/dashboard",
  volunteer: "/volunteer",
  organizer: "/organizer",
};

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold">
          Platform Features
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
          Eight specialized AI modules designed for every stadium stakeholder — from fans navigating
          gates to organizers managing operations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {AI_FEATURES.map((feature) => {
          const Icon = FEATURE_ICONS[feature.icon] ?? Bot;
          const href = FEATURE_LINKS[feature.id] ?? "/chat";

          return (
            <Card key={feature.id} className="group transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="mt-4">{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" size="sm">
                  <Link href={href}>Try it now →</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
