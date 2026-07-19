"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Accessibility,
  ArrowRight,
  Bot,
  Building2,
  HeartHandshake,
  Leaf,
  Map,
  MessageSquare,
  Route,
  Shield,
  Sparkles,
  Siren,
  Users,
} from "lucide-react";
import { APP_NAME, APP_TAGLINE, AI_FEATURES } from "@/constants";
import { BestGateCard } from "@/features/gates/best-gate-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

const STATS = [
  { value: "82K+", label: "Stadium Capacity" },
  { value: "8", label: "AI Features" },
  { value: "9", label: "Languages" },
  { value: "Demo", label: "Simulated Live Data" },
];

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const fadeUp = reduceMotion
    ? { initial: false, animate: undefined }
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-fifa-blue/20 blur-3xl" />
        <div className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-fifa-green/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-fifa-gold/10 blur-3xl" />
      </div>

      <section className="container mx-auto px-4 py-20 md:py-28">
        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-foreground shadow-sm">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>FIFA World Cup 2026 concept · Unofficial demo</span>
          </div>

          <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            <span className="gradient-text">{APP_NAME}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            {APP_TAGLINE}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="gap-2 shadow-lg shadow-primary/25">
              <Link href="#get-me-in">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
                Get Me In
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 bg-card text-foreground">
              <Link href="/chat">
                <MessageSquare className="h-5 w-5" aria-hidden="true" />
                Start AI Chat
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 bg-card text-foreground">
              <Link href="/dashboard">
                <Map className="h-5 w-5" aria-hidden="true" />
                Live Dashboard
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-primary md:text-3xl">{stat.value}</p>
              <p className="text-xs text-muted-foreground md:text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      <section id="get-me-in" className="container mx-auto px-4 pb-16">
        <div className="mx-auto max-w-3xl">
          <BestGateCard />
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold md:text-4xl">
            Eight AI-Powered Features
          </h2>
          <p className="mt-3 text-muted-foreground">
            Everything fans, volunteers, and organizers need in one platform
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {AI_FEATURES.map((feature, i) => {
            const Icon = FEATURE_ICONS[feature.icon] ?? Bot;
            return (
              <motion.div
                key={feature.id}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="group h-full border-border/50 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 transition-colors group-hover:from-primary/30 group-hover:to-accent/30">
                      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link href="/features">
              Explore All Features
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-fifa-blue via-primary to-fifa-green text-white">
          <CardContent className="relative p-8 md:p-16">
            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold md:text-4xl">
                Ready for Match Day?
              </h2>
              <p className="mt-4 text-white/80">
                Switch demo roles in the header to experience fan entry, volunteer incident reporting,
                and organizer operations in under three minutes.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" variant="secondary" className="gap-2">
                  <Link href="/stadium">
                    View Stadium Map
                    <Map className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
