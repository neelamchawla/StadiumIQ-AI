/** Application-wide constants */

export const APP_NAME = "FIFA Stadium Intelligence AI";
export const APP_TAGLINE =
  "The AI-powered digital command center for FIFA World Cup 2026.";
export const APP_VERSION = "1.0.0";

export const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "Home" },
  { href: "/features", label: "Features", icon: "Sparkles" },
  { href: "/chat", label: "AI Chat", icon: "MessageSquare" },
  { href: "/stadium", label: "Stadium Map", icon: "Map" },
  { href: "/dashboard", label: "Live Dashboard", icon: "LayoutDashboard" },
  { href: "/accessibility", label: "Accessibility", icon: "Accessibility" },
  { href: "/volunteer", label: "Volunteer", icon: "HeartHandshake" },
  { href: "/organizer", label: "Organizer", icon: "Building2" },
] as const;

export const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/settings", label: "Settings" },
  { href: "/profile", label: "Profile" },
] as const;

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
] as const;

export const AI_FEATURES = [
  {
    id: "assistant",
    title: "FIFA AI Assistant",
    description: "Multilingual stadium guide for navigation, schedules, and FAQs",
    icon: "Bot",
  },
  {
    id: "crowd_prediction",
    title: "Crowd Prediction AI",
    description: "Real-time gate congestion and wait time predictions",
    icon: "Users",
  },
  {
    id: "route_recommendation",
    title: "Route Recommendation",
    description: "Optimal paths based on accessibility and crowd levels",
    icon: "Route",
  },
  {
    id: "accessibility",
    title: "Accessibility Assistant",
    description: "Voice-enabled guidance for all accessibility needs",
    icon: "Accessibility",
  },
  {
    id: "emergency",
    title: "Emergency AI",
    description: "Instant emergency guidance and evacuation routes",
    icon: "Siren",
  },
  {
    id: "sustainability",
    title: "Sustainability Coach",
    description: "Track and improve your environmental impact",
    icon: "Leaf",
  },
  {
    id: "volunteer",
    title: "Volunteer AI",
    description: "Shift briefings and incident reporting for volunteers",
    icon: "HeartHandshake",
  },
  {
    id: "organizer",
    title: "Organizer Dashboard",
    description: "AI-powered operational intelligence summaries",
    icon: "Building2",
  },
] as const;

export const KEYBOARD_SHORTCUTS = [
  { keys: ["⌘", "K"], action: "Open command palette" },
  { keys: ["⌘", "/"], action: "Open AI chat" },
  { keys: ["⌘", "D"], action: "Toggle dark mode" },
  { keys: ["Esc"], action: "Close dialog" },
] as const;

export const MOCK_VENUE = {
  id: "metlife-stadium",
  name: "MetLife Stadium",
  city: "East Rutherford",
  country: "USA",
  capacity: 82500,
  lat: 40.8128,
  lng: -74.0742,
} as const;

export const MOCK_GATES = [
  {
    id: "gate-a",
    name: "Gate A - North",
    congestionLevel: "low" as const,
    waitTimeMinutes: 5,
    capacity: 8000,
    currentOccupancy: 2400,
    isAccessible: true,
    status: "open" as const,
  },
  {
    id: "gate-b",
    name: "Gate B - East",
    congestionLevel: "moderate" as const,
    waitTimeMinutes: 12,
    capacity: 7500,
    currentOccupancy: 4500,
    isAccessible: true,
    status: "open" as const,
  },
  {
    id: "gate-c",
    name: "Gate C - South",
    congestionLevel: "high" as const,
    waitTimeMinutes: 25,
    capacity: 9000,
    currentOccupancy: 7200,
    isAccessible: false,
    status: "open" as const,
  },
  {
    id: "gate-d",
    name: "Gate D - West",
    congestionLevel: "low" as const,
    waitTimeMinutes: 8,
    capacity: 7000,
    currentOccupancy: 2100,
    isAccessible: true,
    status: "open" as const,
  },
  {
    id: "gate-vip",
    name: "VIP Entrance",
    congestionLevel: "moderate" as const,
    waitTimeMinutes: 10,
    capacity: 2000,
    currentOccupancy: 800,
    isAccessible: true,
    status: "open.pyopen" as const,
  },
] as const;

// Fix the typo in gate-vip status
export const GATES = MOCK_GATES.map((gate) =>
  gate.id === "gate-vip" ? { ...gate, status: "open" as const } : gate,
);

export const EMERGENCY_TYPES = [
  { id: "medical", label: "Medical Emergency", icon: "HeartPulse", priority: "critical" },
  { id: "security", label: "I Feel Unsafe", icon: "ShieldAlert", priority: "high" },
  { id: "lost_child", label: "Lost Child", icon: "Baby", priority: "critical" },
  { id: "fire", label: "Fire / Evacuation", icon: "Flame", priority: "critical" },
  { id: "general", label: "General Help", icon: "HelpCircle", priority: "medium" },
  { id: "weather", label: "Weather Alert", icon: "CloudLightning", priority: "high" },
] as const;
