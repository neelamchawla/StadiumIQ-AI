/** Environment configuration with validation */

function getEnv(key: string, required = false): string {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value ?? "";
}

export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME ?? "FIFA Stadium Intelligence AI",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    version: "1.0.0",
  },
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  },
  firebaseAdmin: {
    projectId: getEnv("FIREBASE_ADMIN_PROJECT_ID"),
    clientEmail: getEnv("FIREBASE_ADMIN_CLIENT_EMAIL"),
    privateKey: getEnv("FIREBASE_ADMIN_PRIVATE_KEY").replace(/\\n/g, "\n"),
  },
  ai: {
    provider: (process.env.AI_PROVIDER ?? "gemini") as "gemini" | "openai",
    geminiApiKey: getEnv("GEMINI_API_KEY"),
    model: process.env.AI_MODEL ?? "gemini-2.0-flash",
    maxTokens: parseInt(process.env.AI_MAX_TOKENS ?? "2048", 10),
    rateLimitPerMinute: parseInt(process.env.AI_RATE_LIMIT_PER_MINUTE ?? "30", 10),
  },
  maps: {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  },
  security: {
    csrfSecret: process.env.CSRF_SECRET ?? "development-csrf-secret",
  },
} as const;

/** Check if Firebase is configured */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    config.firebase.apiKey &&
      config.firebase.projectId &&
      config.firebase.authDomain,
  );
}

/** Check if AI is configured */
export function isAIConfigured(): boolean {
  return Boolean(config.ai.geminiApiKey);
}

/** Check if Google Maps is configured */
export function isMapsConfigured(): boolean {
  return Boolean(config.maps.apiKey);
}
