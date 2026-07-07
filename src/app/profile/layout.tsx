import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your FIFA Stadium Intelligence account and preferences.",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
