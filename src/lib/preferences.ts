import type { AccessibilityNeeds, SupportedLanguage, UserRole } from "@/types";

export const PREFERENCES_STORAGE_KEY = "stadiumiq-preferences";

export interface UserPreferences {
  language: SupportedLanguage;
  role: UserRole;
  accessibilityNeeds: AccessibilityNeeds;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  language: "en",
  role: "fan",
  accessibilityNeeds: {
    wheelchair: false,
    visualImpairment: false,
    hearingImpairment: false,
    mobilityAssistance: false,
    companionRequired: false,
  },
};

export function loadPreferences(): UserPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;

  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw) as Partial<UserPreferences>;
    return {
      language: parsed.language ?? DEFAULT_PREFERENCES.language,
      role: parsed.role ?? DEFAULT_PREFERENCES.role,
      accessibilityNeeds: {
        ...DEFAULT_PREFERENCES.accessibilityNeeds,
        ...parsed.accessibilityNeeds,
      },
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: UserPreferences): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
}

export function updatePreferences(partial: Partial<UserPreferences>): UserPreferences {
  const next = { ...loadPreferences(), ...partial };
  if (partial.accessibilityNeeds) {
    next.accessibilityNeeds = {
      ...loadPreferences().accessibilityNeeds,
      ...partial.accessibilityNeeds,
    };
  }
  savePreferences(next);
  return next;
}
