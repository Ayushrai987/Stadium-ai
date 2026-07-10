// ============================================================
// Rate Limiter — Prevent UI Spam and Abuse
// ============================================================

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

/**
 * Simple sliding-window rate limiter for UI actions.
 * Prevents spam-clicking from flooding stores or API-like interactions.
 *
 * @example
 * const limiter = new RateLimiter();
 * limiter.isAllowed('order', 10, 60000); // max 10 orders per 60 seconds
 */
export class RateLimiter {
  private buckets = new Map<string, RateLimitEntry>();

  /**
   * Check if an action is allowed within the rate limit window.
   * @param key - Unique identifier for the action type
   * @param maxRequests - Maximum number of requests allowed in the window
   * @param windowMs - Time window in milliseconds (default: 60000ms = 1 minute)
   * @returns true if the action is allowed, false if rate limited
   */
  isAllowed(key: string, maxRequests: number, windowMs: number = 60000): boolean {
    const now = Date.now();
    const entry = this.buckets.get(key);

    if (!entry || now - entry.windowStart > windowMs) {
      // New window
      this.buckets.set(key, { count: 1, windowStart: now });
      return true;
    }

    if (entry.count >= maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  /**
   * Get remaining allowed requests for a given key.
   */
  getRemaining(key: string, maxRequests: number, windowMs: number = 60000): number {
    const now = Date.now();
    const entry = this.buckets.get(key);

    if (!entry || now - entry.windowStart > windowMs) {
      return maxRequests;
    }

    return Math.max(0, maxRequests - entry.count);
  }

  /**
   * Reset the rate limit for a given key.
   */
  reset(key: string): void {
    this.buckets.delete(key);
  }

  /**
   * Clear all rate limit buckets.
   */
  clearAll(): void {
    this.buckets.clear();
  }
}

/** Global rate limiter instance */
export const rateLimiter = new RateLimiter();
