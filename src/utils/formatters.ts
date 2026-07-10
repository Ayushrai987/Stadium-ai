// ============================================================
// Smart Stadium Platform — Pure Utility Functions
// ============================================================

/**
 * Format a large number with locale-aware separators.
 * @example formatNumber(45200) => "45,200"
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

/**
 * Format currency value with dollar sign and 2 decimal places.
 * @example formatCurrency(1234.5) => "$1,234.50"
 */
export function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Calculate occupancy percentage from current and capacity.
 * Returns 0 if capacity is 0 to avoid division by zero.
 */
export function calcOccupancyPercent(current: number, capacity: number): number {
  if (capacity <= 0) return 0;
  return Math.round((current / capacity) * 100);
}

/**
 * Clamp a number between min and max bounds.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Round a number to N decimal places.
 */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Generate a short random alphanumeric ID.
 * @example generateId() => "A3F9"
 */
export function generateId(length: number = 4): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().replace(/-/g, '').substring(0, length).toUpperCase();
  }
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
    .toUpperCase();
}

/**
 * Format elapsed time since a timestamp in human-readable form.
 * @example formatTimeAgo(Date.now() - 120000) => "2 min ago"
 */
export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

/**
 * Get severity color for a given severity level.
 */
export function getSeverityColor(severity: 'info' | 'warning' | 'critical' | 'emergency'): string {
  const colors: Record<string, string> = {
    info: '#3b82f6',
    warning: '#f59e0b',
    critical: '#ef4444',
    emergency: '#dc2626',
  };
  return colors[severity] || '#94a3b8';
}

/**
 * Get heat color for an occupancy percentage (0-100).
 * Green (safe) → Yellow (warning) → Red (critical).
 */
export function getHeatColor(percent: number): string {
  const clamped = clamp(percent, 0, 100);
  if (clamped < 50) {
    const ratio = clamped / 50;
    const r = Math.round(ratio * 255);
    const g = 255;
    return `rgb(${r}, ${g}, 50)`;
  }
  const ratio = (clamped - 50) / 50;
  const r = 255;
  const g = Math.round((1 - ratio) * 255);
  return `rgb(${r}, ${g}, 50)`;
}

/**
 * Throttle a function to only execute once within the specified interval.
 */
export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  intervalMs: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= intervalMs) {
      lastCall = now;
      fn(...args);
    }
  };
}

/**
 * Debounce a function to only execute after the delay has passed since the last call.
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}
