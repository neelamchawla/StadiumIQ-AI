import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, Globe, Shield, Zap } from "lucide-react";
import { APP_NAME, APP_TAGLINE, APP_VERSION } from "@/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about FIFA Stadium Intelligence AI and its mission for World Cup 2026.",
};

const HIGHLIGHTS = [
  {
    icon: Bot,
    title: "AI-First Design",
    description: "Eight specialized AI modules powered by Gemini, serving fans in 9 languages.",
  },
  {
    icon: Globe,
    title: "World Cup Ready",
    description: "Built for FIFA World Cup 2026 host venues with real-time operational intelligence.",
  },
  {
    icon: Shield,
    title: "Safety & Accessibility",
    description: "Emergency AI, accessible routing, and inclusive design for all attendees.",
  },
  {
    icon: Zap,
    title: "Real-Time Intelligence",
    description: "Live crowd predictions, gate congestion, weather alerts, and sustainability tracking.",
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold">
          About {APP_NAME}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{APP_TAGLINE}</p>
        <p className="mt-2 text-sm text-muted-foreground">Version {APP_VERSION}</p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
        {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="mt-2">{title}</CardTitle>
              <CardDescription className="text-base">{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="mx-auto mt-12 max-w-3xl">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold">Built for the Beautiful Game</h2>
          <p className="mt-4 text-muted-foreground">
            FIFA Stadium Intelligence AI combines cutting-edge artificial intelligence with
            real-time stadium data to create the ultimate digital companion for World Cup 2026.
            Whether you&apos;re a fan finding the best gate, a volunteer managing crowds, or an
            organizer overseeing operations — we&apos;ve got you covered.
          </p>
          <Button asChild className="mt-6 gap-2">
            <Link href="/chat">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
