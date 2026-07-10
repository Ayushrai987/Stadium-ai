// ============================================================
// Input Sanitization — XSS Prevention
// ============================================================

const HTML_ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#96;',
};

const HTML_ENTITY_REGEX = /[&<>"'/`]/g;

/**
 * Encode HTML entities to prevent XSS attacks in dynamic text content.
 * @example sanitizeHTML('<script>alert("xss")</script>') => '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
 */
export function sanitizeHTML(input: string): string {
  if (typeof input !== 'string') return '';
  return input.replace(HTML_ENTITY_REGEX, (char) => HTML_ENTITY_MAP[char] || char);
}

/**
 * Validate and sanitize a string input with max length enforcement.
 * Returns null if the input is invalid.
 */
export function validateStringInput(
  input: unknown,
  maxLength: number = 500
): string | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (trimmed.length === 0 || trimmed.length > maxLength) return null;
  return sanitizeHTML(trimmed);
}

/**
 * Validate that a numeric value is within expected bounds.
 */
export function validateNumericInput(
  input: unknown,
  min: number = 0,
  max: number = Number.MAX_SAFE_INTEGER
): number | null {
  if (typeof input !== 'number' || isNaN(input) || !isFinite(input)) return null;
  if (input < min || input > max) return null;
  return input;
}

/**
 * Validate an email address format (basic validation).
 */
export function validateEmail(input: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
}

/**
 * Strip all HTML tags from a string, leaving only text content.
 */
export function stripHTMLTags(input: string): string {
  if (typeof input !== 'string') return '';
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Check if a string contains potential script injection patterns.
 */
export function containsInjectionPattern(input: string): boolean {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
    /url\s*\(/i,
  ];
  return dangerousPatterns.some((pattern) => pattern.test(input));
}
