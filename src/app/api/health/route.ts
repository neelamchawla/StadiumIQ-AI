import { config, isAIConfigured, isFirebaseConfigured, isMapsConfigured } from "@/config";
import { successResponse } from "@/lib/api-response";

export async function GET() {
  const checks = {
    ai: isAIConfigured(),
    firebase: isFirebaseConfigured(),
    maps: isMapsConfigured(),
  };

  const status = "healthy";

  return successResponse({
    status,
    version: config.app.version,
    name: config.app.name,
    timestamp: new Date().toISOString(),
    checks,
  });
}
