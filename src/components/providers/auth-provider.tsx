"use client";

import * as React from "react";
import {
  DEFAULT_PREFERENCES,
  loadPreferences,
  updatePreferences,
  type UserPreferences,
} from "@/lib/preferences";
import type { UserRole } from "@/types";

interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  preferences: UserPreferences;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setDemoRole: (role: UserRole) => void;
  setLanguage: (language: UserPreferences["language"]) => void;
  setAccessibilityNeeds: (needs: UserPreferences["accessibilityNeeds"]) => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

const DEMO_USERS: Record<"fan" | "volunteer" | "organizer", AuthUser> = {
  fan: {
    uid: "demo-fan",
    email: "fan@stadiumiq.demo",
    displayName: "Demo Fan",
    role: "fan",
  },
  volunteer: {
    uid: "demo-volunteer",
    email: "volunteer@stadiumiq.demo",
    displayName: "Demo Volunteer",
    role: "volunteer",
  },
  organizer: {
    uid: "demo-organizer",
    email: "organizer@stadiumiq.demo",
    displayName: "Demo Organizer",
    role: "organizer",
  },
};

function roleToDemoUser(role: UserRole): AuthUser {
  if (role === "volunteer") return DEMO_USERS.volunteer;
  if (role === "organizer") return DEMO_USERS.organizer;
  return DEMO_USERS.fan;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [preferences, setPreferences] = React.useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const prefs = loadPreferences();
    setPreferences(prefs);
    const stored = localStorage.getItem("stadiumiq-user");
    if (stored) {
      try {
        setUser(JSON.parse(stored) as AuthUser);
      } catch {
        const demo = roleToDemoUser(prefs.role);
        setUser(demo);
        localStorage.setItem("stadiumiq-user", JSON.stringify(demo));
      }
    } else {
      const demo = roleToDemoUser(prefs.role);
      setUser(demo);
      localStorage.setItem("stadiumiq-user", JSON.stringify(demo));
    }
    setIsLoading(false);
  }, []);

  const signIn = React.useCallback(async (_email: string, _password: string) => {
    const prefs = loadPreferences();
    const demo = roleToDemoUser(prefs.role === "staff" || prefs.role === "security" ? "fan" : prefs.role);
    setUser(demo);
    localStorage.setItem("stadiumiq-user", JSON.stringify(demo));
  }, []);

  const signOut = React.useCallback(async () => {
    setUser(null);
    localStorage.removeItem("stadiumiq-user");
  }, []);

  const setDemoRole = React.useCallback((role: UserRole) => {
    const safeRole = role === "staff" || role === "security" ? "fan" : role;
    const nextPrefs = updatePreferences({ role: safeRole });
    setPreferences(nextPrefs);
    const demo = roleToDemoUser(safeRole);
    setUser(demo);
    localStorage.setItem("stadiumiq-user", JSON.stringify(demo));
  }, []);

  const setLanguage = React.useCallback((language: UserPreferences["language"]) => {
    setPreferences(updatePreferences({ language }));
  }, []);

  const setAccessibilityNeeds = React.useCallback(
    (needs: UserPreferences["accessibilityNeeds"]) => {
      setPreferences(updatePreferences({ accessibilityNeeds: needs }));
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        preferences,
        signIn,
        signOut,
        setDemoRole,
        setLanguage,
        setAccessibilityNeeds,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
