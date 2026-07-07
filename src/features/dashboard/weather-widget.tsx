import { Cloud, Droplets, Thermometer, Wind } from "lucide-react";
import { getWeatherAlert } from "@/services/stadium/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function WeatherWidget() {
  const weather = getWeatherAlert();

  const alertVariant =
    weather.alertLevel === "severe"
      ? "danger"
      : weather.alertLevel === "warning"
        ? "warning"
        : weather.alertLevel === "advisory"
          ? "warning"
          : "success";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Stadium Weather</CardTitle>
          <Badge variant={alertVariant} className="capitalize">
            {weather.alertLevel === "none" ? "Clear" : weather.alertLevel}
          </Badge>
        </div>
        <CardDescription>Live conditions at the venue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400/20 to-blue-500/20">
            <Cloud className="h-8 w-8 text-sky-500" />
          </div>
          <div>
            <p className="text-3xl font-bold">{weather.temperature}°F</p>
            <p className="text-sm text-muted-foreground">{weather.condition}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
            <Droplets className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="text-sm font-semibold">{weather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
            <Wind className="h-4 w-4 text-teal-500" />
            <div>
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="text-sm font-semibold">{weather.windSpeed} mph</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-lg border border-border/50 bg-muted/30 p-3">
          <Thermometer className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">{weather.message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
