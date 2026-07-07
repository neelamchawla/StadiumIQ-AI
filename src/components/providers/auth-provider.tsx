"use client";

import * as React from "react";
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
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

const DEMO_USER: AuthUser = {
  uid: "demo-user",
  email: "fan@fifa2026.com",
  displayName: "Demo Fan",
  role: "fan",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const stored = localStorage.getItem("stadiumiq-user");
    if (stored) {
      try {
        setUser(JSON.parse(stored) as AuthUser);
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = React.useCallback(async (_email: string, _password: string) => {
    setUser(DEMO_USER);
    localStorage.setItem("stadiumiq-user", JSON.stringify(DEMO_USER));
  }, []);

  const signOut = React.useCallback(async () => {
    setUser(null);
    localStorage.removeItem("stadiumiq-user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
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
