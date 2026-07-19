"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, User, X } from "lucide-react";
import { useMemo, useState } from "react";
import { APP_NAME, NAV_ITEMS, ROLE_NAV } from "@/constants";
import { useAuth } from "@/components/providers/auth-provider";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { getNavIcon } from "@/lib/nav-icons";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, preferences, setDemoRole } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const roleKey = (preferences.role === "volunteer" || preferences.role === "organizer"
    ? preferences.role
    : "fan") as "fan" | "volunteer" | "organizer";

  const visibleNav = useMemo(() => {
    const allowed = new Set(ROLE_NAV[roleKey]);
    return NAV_ITEMS.filter((item) => allowed.has(item.href));
  }, [roleKey]);

  const handleRoleChange = (role: string) => {
    setDemoRole(role as UserRole);
    const landing =
      role === "volunteer" ? "/volunteer" : role === "organizer" ? "/organizer" : "/";
    router.push(landing);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" aria-label={`${APP_NAME} home`}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-fifa-blue to-fifa-green text-white shadow-lg">
            <span className="text-sm font-bold" aria-hidden="true">
              ⚽
            </span>
          </div>
          <span className="hidden font-bold sm:inline-block">
            <span className="gradient-text">{APP_NAME.split(" ")[0]}</span>
            <span className="text-foreground"> Stadium IQ</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {visibleNav.map((item) => {
            const Icon = getNavIcon(item.icon);
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <Label htmlFor="demo-role" className="sr-only">
              Demo role
            </Label>
            <Select value={roleKey} onValueChange={handleRoleChange}>
              <SelectTrigger id="demo-role" className="h-9 w-[140px]" aria-label="Switch demo role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fan">Fan</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
                <SelectItem value="organizer">Organizer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ThemeToggle />

          <Link href="/profile">
            <Button variant="ghost" size="sm" className="hidden gap-2 sm:flex">
              <User className="h-4 w-4" aria-hidden="true" />
              {user?.displayName ?? "Guest"}
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-navigation"
          className="border-t border-border/40 bg-background px-4 py-4 lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="mb-3">
            <Label htmlFor="demo-role-mobile" className="mb-1 block text-xs text-muted-foreground">
              Demo role
            </Label>
            <Select value={roleKey} onValueChange={handleRoleChange}>
              <SelectTrigger id="demo-role-mobile" aria-label="Switch demo role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fan">Fan</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
                <SelectItem value="organizer">Organizer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            {visibleNav.map((item) => {
              const Icon = getNavIcon(item.icon);
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
