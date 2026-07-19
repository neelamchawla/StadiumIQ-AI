"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, Loader2, MapPin, Plus } from "lucide-react";
import { submitIncidentReport } from "@/app/actions/incident";
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
  const [incidentType, setIncidentType] = useState("crowd");
  const [severity, setSeverity] = useState<"low" | "medium" | "high" | "critical">("medium");

  const handleSubmitIncident = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const location = String(formData.get("location") ?? "");
    const description = String(formData.get("description") ?? "");

    const result = await submitIncidentReport({
      type: incidentType,
      location,
      description,
      severity,
    });

    if (result.success) {
      toast({
        title: "Incident Reported",
        description: "Your report is now visible on the Organizer dashboard.",
      });
      setShowForm(false);
      form.reset();
      setIncidentType("crowd");
      setSeverity("medium");
    } else {
      toast({
        title: "Submission failed",
        description: result.error ?? "Could not submit incident.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Volunteer Tasks</h2>
          <p className="text-muted-foreground">Your assigned duties for today&apos;s match</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} aria-expanded={showForm}>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
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
                  <Select value={incidentType} onValueChange={setIncidentType}>
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
                <Label htmlFor="incident-severity">Severity</Label>
                <Select value={severity} onValueChange={(v) => setSeverity(v as typeof severity)}>
                  <SelectTrigger id="incident-severity">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="incident-description">Description</Label>
                <Textarea
                  id="incident-description"
                  name="description"
                  placeholder="Describe the incident..."
                  required
                  minLength={10}
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
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
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      {task.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      Due {new Date(task.dueAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                    task.status === "completed" && "bg-green-100 text-green-900 dark:bg-green-500/20 dark:text-green-200",
                    task.status === "in_progress" && "bg-amber-100 text-amber-950 dark:bg-amber-500/20 dark:text-amber-200",
                    task.status === "pending" && "bg-muted text-muted-foreground",
                  )}
                >
                  <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
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
