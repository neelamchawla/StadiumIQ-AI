/** HTML escaping and input sanitization utilities */

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
};

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(text: string): string {
  return text.replace(/[&<>"'/]/g, (char) => HTML_ENTITIES[char] ?? char);
}

/**
 * Sanitize user input for AI prompts
 * Removes potential prompt injection patterns
 */
export function sanitizePromptInput(input: string): string {
  return input
    .trim()
    .slice(0, 2000)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .replace(/(?:system|assistant|user):\s*/gi, "")
    .replace(/<\/?(?:script|iframe|object|embed|form)[^>]*>/gi, "");
}

/**
 * Strip HTML tags from a string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/**
 * Validate and sanitize a URL
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Mask sensitive data for logging
 */
export function maskSensitive(value: string, visibleChars = 4): string {
  if (value.length <= visibleChars * 2) return "***";
  return `${value.slice(0, visibleChars)}...${value.slice(-visibleChars)}`;
}
