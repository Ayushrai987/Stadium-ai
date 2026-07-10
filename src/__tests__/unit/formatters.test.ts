import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  formatCurrency,
  calcOccupancyPercent,
  clamp,
  roundTo,
  generateId,
  formatTimeAgo,
  getSeverityColor,
  getHeatColor,
} from '../../utils/formatters';

describe('Formatters & Utility Functions', () => {
  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(1234)).toBe('1,234');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });
  });

  describe('formatCurrency', () => {
    it('should format values as USD currency', () => {
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(12.5)).toBe('$12.50');
      expect(formatCurrency(1234.567)).toBe('$1,234.57');
    });
  });

  describe('calcOccupancyPercent', () => {
    it('should calculate percentage correctly', () => {
      expect(calcOccupancyPercent(50, 100)).toBe(50);
      expect(calcOccupancyPercent(0, 50)).toBe(0);
      expect(calcOccupancyPercent(80, 80)).toBe(100);
    });

    it('should handle division by zero safely', () => {
      expect(calcOccupancyPercent(50, 0)).toBe(0);
      expect(calcOccupancyPercent(50, -10)).toBe(0);
    });
  });

  describe('clamp', () => {
    it('should clamp values between boundaries', () => {
      expect(clamp(5, 1, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('roundTo', () => {
    it('should round to specified decimals', () => {
      expect(roundTo(1.2345, 2)).toBe(1.23);
      expect(roundTo(1.2355, 2)).toBe(1.24);
      expect(roundTo(1.2, 0)).toBe(1);
    });
  });

  describe('generateId', () => {
    it('should generate ID of correct length', () => {
      const id = generateId(6);
      expect(id).toHaveLength(6);
      expect(typeof id).toBe('string');
    });

    it('should generate uppercase alphanumeric strings', () => {
      const id = generateId(8);
      expect(id).toMatch(/^[A-Z0-9]{8}$/);
    });
  });

  describe('formatTimeAgo', () => {
    it('should format dynamic elapsed times', () => {
      const now = Date.now();
      expect(formatTimeAgo(now - 5000)).toMatch(/s ago$/);
      expect(formatTimeAgo(now - 120_000)).toBe('2 min ago');
      expect(formatTimeAgo(now - 7200_000)).toBe('2h ago');
    });
  });

  describe('getSeverityColor', () => {
    it('should return matching hex color codes', () => {
      expect(getSeverityColor('info')).toBe('#3b82f6');
      expect(getSeverityColor('warning')).toBe('#f59e0b');
      expect(getSeverityColor('critical')).toBe('#ef4444');
      expect(getSeverityColor('emergency')).toBe('#dc2626');
      // @ts-expect-error test invalid string
      expect(getSeverityColor('invalid')).toBe('#94a3b8');
    });
  });

  describe('getHeatColor', () => {
    it('should return rgb color values based on percentage bounds', () => {
      expect(getHeatColor(0)).toContain('rgb(');
      expect(getHeatColor(50)).toContain('rgb(');
      expect(getHeatColor(100)).toContain('rgb(');
    });
  });
});
