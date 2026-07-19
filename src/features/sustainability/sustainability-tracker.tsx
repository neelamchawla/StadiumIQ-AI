"use client";

import { Bus, Footprints, Leaf, Recycle, Trophy, Zap } from "lucide-react";
import { getSustainabilityMetrics } from "@/services/stadium/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const TIPS = [
  "Use the refill stations instead of buying bottled water",
  "Take public transit to reduce your carbon footprint",
  "Sort waste at designated recycling points",
  "Walk between nearby fan zones when possible",
  "Share your sustainability streak with fellow fans!",
];

export function SustainabilityTracker() {
  const metrics = getSustainabilityMetrics();
  const goalKg = 10;
  const progressPct = Math.min((metrics.carbonSavedKg / goalKg) * 100, 100);

  const statItems = [
    { icon: Recycle, label: "Bottle Refills", value: metrics.reusableBottleUses, unit: "uses" },
    { icon: Bus, label: "Transit Trips", value: metrics.publicTransportTrips, unit: "trips" },
    { icon: Footprints, label: "Walking", value: metrics.walkingDistanceKm, unit: "km" },
    { icon: Leaf, label: "Waste Sorted", value: metrics.wasteSortedKg, unit: "kg" },
  ];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-fifa-green/20 via-emerald-500/10 to-teal-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-fifa-green" />
                Sustainability Score
              </CardTitle>
              <CardDescription className="mt-1">Your environmental impact today</CardDescription>
            </div>
            <Badge variant="success" className="gap-1 text-sm">
              <Trophy className="h-3.5 w-3.5" />
              {metrics.streakDays} day streak
            </Badge>
          </div>

          <div className="mt-6">
            <div className="flex items-end justify-between">
              <p className="text-4xl font-bold">{metrics.carbonSavedKg} kg</p>
              <p className="text-sm text-muted-foreground">CO₂ saved of {goalKg} kg goal</p>
            </div>
            <Progress
              value={Number.isFinite(progressPct) ? progressPct : 0}
              className="mt-3 h-3"
              aria-label={`Carbon savings progress: ${metrics.carbonSavedKg} of ${goalKg} kilograms`}
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map(({ icon: Icon, label, value, unit }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-fifa-green/10">
                <Icon className="h-5 w-5 text-fifa-green" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-lg font-bold">
                  {value} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5 text-yellow-500" />
            Eco Tips
          </CardTitle>
          <CardDescription>Quick ways to boost your sustainability score</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {TIPS.map((tip, i) => (
              <li
                key={tip}
                className="flex items-start gap-3 rounded-lg border border-border/50 p-3 text-sm"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fifa-green/10 text-xs font-bold text-fifa-green">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
