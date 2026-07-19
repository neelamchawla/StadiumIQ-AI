import { config } from "@/config";
import { successResponse } from "@/lib/api-response";

/**
 * Public health check — intentionally avoids disclosing which secrets are configured.
 */
export async function GET() {
  return successResponse({
    status: "ok",
    version: config.app.version,
    name: config.app.name,
    timestamp: new Date().toISOString(),
  });
}
