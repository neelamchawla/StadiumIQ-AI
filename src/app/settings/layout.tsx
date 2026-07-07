import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Customize language, notifications, and privacy settings for your stadium experience.",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
