"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, Loader2, MapPin, Plus } from "lucide-react";
import { getVolunteerTasks } from "@/services/stadium/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const PRIORITY_VARIANTS = {
  low: "secondary" as const,
  medium: "warning" as const,
  high: "danger" as const,
};

const STATUS_ICONS = {
  pending: Clock,
  in_progress: AlertTriangle,
  completed: CheckCircle2,
};

export function VolunteerDashboard() {
  const tasks = getVolunteerTasks();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitIncident = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast({ title: "Incident Reported", description: "Your report has been submitted to organizers." });
    setShowForm(false);
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Volunteer Tasks</h2>
          <p className="text-muted-foreground">Your assigned duties for today&apos;s match</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Report Incident
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Report Incident</CardTitle>
            <CardDescription>Submit a new incident for organizer review</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => void handleSubmitIncident(e)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="incident-type">Incident Type</Label>
                  <Select name="type" required>
                    <SelectTrigger id="incident-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crowd">Crowd Density</SelectItem>
                      <SelectItem value="accessibility">Accessibility</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incident-location">Location</Label>
                  <Input id="incident-location" name="location" placeholder="e.g. Gate C - South" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="incident-description">Description</Label>
                <Textarea
                  id="incident-description"
                  name="description"
                  placeholder="Describe the incident..."
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Report
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {tasks.map((task) => {
          const StatusIcon = STATUS_ICONS[task.status];

          return (
            <Card key={task.id} className="transition-colors hover:bg-muted/20">
              <CardContent className="flex items-start justify-between gap-4 pt-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{task.title}</h3>
                    <Badge variant={PRIORITY_VARIANTS[task.priority]}>{task.priority}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {task.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Due {new Date(task.dueAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                    task.status === "completed" && "bg-green-500/10 text-green-600",
                    task.status === "in_progress" && "bg-yellow-500/10 text-yellow-600",
                    task.status === "pending" && "bg-muted text-muted-foreground",
                  )}
                >
                  <StatusIcon className="h-3.5 w-3.5" />
                  {task.status.replace("_", " ")}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
