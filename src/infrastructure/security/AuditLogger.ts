// ============================================================
// Structured Audit Logger — Immutable Decision Trail
// ============================================================

export interface AuditEntry {
  id: string;
  timestamp: number;
  actor: string;
  actorRole: 'system' | 'operator' | 'admin' | 'fan';
  action: string;
  resource: string;
  resourceType: string;
  details: string;
  result: 'success' | 'failure' | 'denied' | 'rate-limited';
  metadata?: Record<string, unknown>;
}

type AuditSubscriber = (entry: AuditEntry) => void;

/**
 * Immutable audit logger for all state-changing and privacy-sensitive operations.
 * Entries cannot be modified or deleted once logged.
 * Supports real-time subscribers for UI display.
 */
class AuditLogger {
  private readonly entries: AuditEntry[] = [];
  private readonly subscribers: Set<AuditSubscriber> = new Set();
  private idCounter = 0;

  /**
   * Log an auditable action. Returns the created entry ID.
   */
  log(
    entry: Omit<AuditEntry, 'id' | 'timestamp'>
  ): string {
    const id = `audit-${++this.idCounter}-${Date.now()}`;
    const fullEntry: AuditEntry = {
      ...entry,
      id,
      timestamp: Date.now(),
    };

    // Freeze the entry to prevent mutation
    Object.freeze(fullEntry);
    this.entries.push(fullEntry);

    // Notify subscribers
    this.subscribers.forEach((fn) => {
      try {
        fn(fullEntry);
      } catch {
        // Subscriber errors must not break audit logging
      }
    });

    // Also log to console in development
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug('[AUDIT]', fullEntry.action, fullEntry);
    }

    return id;
  }

  /**
   * Convenience method for logging operator actions.
   */
  logOperatorAction(action: string, resource: string, details: string, result: AuditEntry['result'] = 'success'): string {
    return this.log({
      actor: 'Operator',
      actorRole: 'operator',
      action,
      resource,
      resourceType: 'incident',
      details,
      result,
    });
  }

  /**
   * Convenience method for logging system-automated actions.
   */
  logSystemAction(action: string, resource: string, details: string): string {
    return this.log({
      actor: 'System',
      actorRole: 'system',
      action,
      resource,
      resourceType: 'automated',
      details,
      result: 'success',
    });
  }

  /**
   * Convenience method for logging fan/user actions.
   */
  logFanAction(action: string, resource: string, details: string, result: AuditEntry['result'] = 'success'): string {
    return this.log({
      actor: 'Fan App',
      actorRole: 'fan',
      action,
      resource,
      resourceType: 'user-data',
      details,
      result,
    });
  }

  /**
   * Get all audit entries (returns frozen copies).
   */
  getEntries(): readonly AuditEntry[] {
    return Object.freeze([...this.entries]);
  }

  /**
   * Get entries filtered by actor role.
   */
  getEntriesByRole(role: AuditEntry['actorRole']): readonly AuditEntry[] {
    return Object.freeze(this.entries.filter((e) => e.actorRole === role));
  }

  /**
   * Get entries from the last N minutes.
   */
  getRecentEntries(minutes: number): readonly AuditEntry[] {
    const since = Date.now() - minutes * 60_000;
    return Object.freeze(this.entries.filter((e) => e.timestamp >= since));
  }

  /**
   * Subscribe to new audit entries in real-time.
   */
  subscribe(fn: AuditSubscriber): () => void {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  /**
   * Get total entry count.
   */
  get count(): number {
    return this.entries.length;
  }
}

/** Global audit logger singleton */
export const auditLogger = new AuditLogger();
