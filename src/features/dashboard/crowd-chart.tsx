"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getGateStatuses } from "@/services/stadium/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CONGESTION_COLORS: Record<string, string> = {
  low: "#00A651",
  moderate: "#FFD700",
  high: "#FF8C00",
  critical: "#E4002B",
};

export function CrowdChart() {
  const gates = getGateStatuses();
  const data = gates.map((gate) => ({
    name: gate.name.replace("Gate ", "").split(" - ")[0],
    wait: gate.waitTimeMinutes,
    occupancy: Math.round((gate.currentOccupancy / gate.capacity) * 100),
    level: gate.congestionLevel,
  }));

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Gate Congestion Overview</CardTitle>
        <CardDescription>Wait times and occupancy by entrance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number, name: string) => [
                  name === "wait" ? `${value} min` : `${value}%`,
                  name === "wait" ? "Wait Time" : "Occupancy",
                ]}
              />
              <Bar
                dataKey="wait"
                name="wait"
                radius={[6, 6, 0, 0]}
                fill="hsl(var(--primary))"
              />
              <Bar
                dataKey="occupancy"
                name="occupancy"
                radius={[6, 6, 0, 0]}
                fill="hsl(var(--accent))"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {Object.entries(CONGESTION_COLORS).map(([level, color]) => (
            <div key={level} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="capitalize">{level}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
