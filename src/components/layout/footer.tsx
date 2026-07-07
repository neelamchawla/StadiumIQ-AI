import Link from "next/link";
import { APP_NAME, APP_TAGLINE, APP_VERSION, FOOTER_LINKS } from "@/constants";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fifa-blue to-fifa-green text-sm text-white">
                ⚽
              </div>
              <span className="font-bold">{APP_NAME}</span>
            </div>
            <p className="text-sm text-muted-foreground">{APP_TAGLINE}</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">FIFA World Cup 2026</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered stadium intelligence for fans, volunteers, and organizers across all host
              venues.
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p suppressHydrationWarning>© 2026 {APP_NAME}. All rights reserved.</p>
          <p>Version {APP_VERSION}</p>
        </div>
      </div>
    </footer>
  );
}
