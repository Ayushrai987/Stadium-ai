import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RateLimiter } from '../../infrastructure/security/RateLimiter';

describe('Rate Limiter Utility', () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    limiter = new RateLimiter();
    vi.useFakeTimers();
  });

  it('should allow requests within limit threshold bounds', () => {
    const key = 'test-action';
    expect(limiter.isAllowed(key, 3)).toBe(true);
    expect(limiter.isAllowed(key, 3)).toBe(true);
    expect(limiter.isAllowed(key, 3)).toBe(true);
  });

  it('should block requests exceeding the maximum allowed limit', () => {
    const key = 'spam-action';
    expect(limiter.isAllowed(key, 2)).toBe(true);
    expect(limiter.isAllowed(key, 2)).toBe(true);
    expect(limiter.isAllowed(key, 2)).toBe(false); // blocked!
  });

  it('should reset limits after the time window expires', () => {
    const key = 'reset-action';
    expect(limiter.isAllowed(key, 1, 1000)).toBe(true);
    expect(limiter.isAllowed(key, 1, 1000)).toBe(false); // blocked

    // Advance clock past 1 second window
    vi.advanceTimersByTime(1100);

    expect(limiter.isAllowed(key, 1, 1000)).toBe(true); // allowed again!
  });

  it('should return correct remaining allowed requests count', () => {
    const key = 'remaining-action';
    expect(limiter.getRemaining(key, 5)).toBe(5);
    limiter.isAllowed(key, 5);
    expect(limiter.getRemaining(key, 5)).toBe(4);
  });

  it('should clear specific key limits when reset is executed', () => {
    const key = 'clear-action';
    limiter.isAllowed(key, 1);
    expect(limiter.isAllowed(key, 1)).toBe(false); // blocked
    
    limiter.reset(key);
    expect(limiter.isAllowed(key, 1)).toBe(true); // allowed!
  });
});
