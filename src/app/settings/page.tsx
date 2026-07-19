"use client";

import { Bell, Globe, Moon, Shield } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/constants";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toaster";
import type { SupportedLanguage } from "@/types";

export default function SettingsPage() {
  const { preferences, setLanguage } = useAuth();

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-muted-foreground">Customize your stadium experience</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5" aria-hidden="true" />
              Language & Region
            </CardTitle>
            <CardDescription>Choose your preferred language for AI responses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="language-select">Language</Label>
              <Select
                value={preferences.language}
                onValueChange={(v) => {
                  setLanguage(v as SupportedLanguage);
                  const lang = SUPPORTED_LANGUAGES.find((l) => l.code === v);
                  toast({ title: "Language updated", description: `Set to ${lang?.label}. AI chat will use this preference.` });
                }}
              >
                <SelectTrigger id="language-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5" aria-hidden="true" />
              Notifications
            </CardTitle>
            <CardDescription>Manage alerts and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: "crowd", label: "Crowd Alerts", description: "Gate congestion and wait time updates" },
              { id: "weather", label: "Weather Alerts", description: "Severe weather notifications" },
              { id: "emergency", label: "Emergency Alerts", description: "Critical safety notifications" },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <Label htmlFor={item.id}>{item.label}</Label>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Switch id={item.id} defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Moon className="h-5 w-5" aria-hidden="true" />
              Appearance
            </CardTitle>
            <CardDescription>Theme is controlled via the header toggle</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use the sun/moon icon in the header to switch between light and dark mode.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5" aria-hidden="true" />
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="share-location">Share location for routing</Label>
                <p className="text-sm text-muted-foreground">Improve route recommendations</p>
              </div>
              <Switch id="share-location" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="analytics">Analytics</Label>
                <p className="text-sm text-muted-foreground">Help improve the platform</p>
              </div>
              <Switch id="analytics" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
