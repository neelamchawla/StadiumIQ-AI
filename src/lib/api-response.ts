import { NextResponse } from "next/server";

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorBody;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function successResponse<T>(data: T, status = 200): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}

export function errorResponse(
  message: string,
  status = 400,
  code = "BAD_REQUEST",
  details?: unknown,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details !== undefined ? { details } : {}),
      },
    },
    { status },
  );
}

/**
 * Extract client IP from request headers.
 * Prefer platform-provided identity headers over the first X-Forwarded-For hop
 * (which clients can spoof when not stripped by a trusted proxy).
 */
export function getClientIp(request: Request): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const vercelForwarded = request.headers.get("x-vercel-forwarded-for");
  if (vercelForwarded) {
    return vercelForwarded.split(",")[0]?.trim() ?? "anonymous";
  }

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // Use the last hop when a trusted proxy appends the true client IP.
    const parts = forwarded.split(",").map((part) => part.trim()).filter(Boolean);
    return parts.at(-1) ?? "anonymous";
  }

  return "anonymous";
}
