"use client";

import { User, Mail, Globe, Shield, Leaf } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { SUPPORTED_LANGUAGES } from "@/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toaster";

export default function ProfilePage() {
  const { user, signIn, signOut } = useAuth();

  const handleSignIn = async () => {
    await signIn("fan@fifa2026.com", "demo");
    toast({ title: "Signed in", description: "Welcome to FIFA Stadium Intelligence!" });
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold">Profile</h1>
        <p className="mt-1 text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-fifa-blue to-fifa-green text-2xl text-white">
              <User className="h-8 w-8" />
            </div>
            <div>
              <CardTitle>{user?.displayName ?? "Guest User"}</CardTitle>
              <CardDescription>{user?.email ?? "Not signed in"}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {user ? (
            <>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Shield className="h-3 w-3" />
                  {user.role}
                </Badge>
                <Badge variant="success" className="gap-1">
                  <Leaf className="h-3 w-3" />
                  Eco Score: 78
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input id="displayName" defaultValue={user.displayName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="email" defaultValue={user.email} className="pl-10" disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Preferred Language</Label>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {SUPPORTED_LANGUAGES[0].flag} {SUPPORTED_LANGUAGES[0].label}
                    </span>
                  </div>
                </div>
              </div>

              <Button variant="destructive" onClick={() => void signOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="mb-4 text-muted-foreground">Sign in to access your profile and preferences</p>
              <Button onClick={() => void handleSignIn()}>Sign In (Demo)</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
