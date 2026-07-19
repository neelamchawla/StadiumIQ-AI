import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CommandPalette } from "@/components/layout/command-palette";
import { Toaster } from "@/components/ui/toaster";
import { APP_NAME, APP_TAGLINE } from "@/constants";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const siteDescription =
  "AI-powered digital command center for FIFA World Cup 2026 — best-gate routing, accessibility guidance, emergency help, and volunteer operations.";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#003087" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1F3A" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: siteDescription,
  applicationName: APP_NAME,
  keywords: [
    "FIFA",
    "World Cup 2026",
    "Stadium IQ",
    "Stadium Intelligence",
    "Crowd prediction",
    "Accessible routing",
    "Emergency AI",
    "Volunteer ops",
  ],
  authors: [{ name: "StadiumIQ-AI" }],
  creator: "StadiumIQ-AI",
  publisher: "StadiumIQ-AI",
  category: "sports",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.svg"],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: APP_NAME,
    title: APP_NAME,
    description: siteDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${APP_NAME} — ${APP_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: siteDescription,
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: APP_NAME,
    description: siteDescription,
    url: siteUrl,
    applicationCategory: "SportsApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} min-h-screen font-sans antialiased`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <AuthProvider>
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <CommandPalette />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
