import { describe, it, expect, vi, beforeEach } from 'vitest';
import { auditLogger } from '../../infrastructure/security/AuditLogger';

describe('Audit Logger Subsystem', () => {
  beforeEach(() => {
    // Reset subscriber set and records count if necessary (auditLogger has private state)
    // We can test standard logging workflows
  });

  it('should generate structured frozen log entries', () => {
    const logId = auditLogger.log({
      actor: 'Tester',
      actorRole: 'admin',
      action: 'Run Tests',
      resource: 'test-suite',
      resourceType: 'system',
      details: 'Executing unit test cases',
      result: 'success',
    });

    expect(logId).toContain('audit-');
    
    const entries = auditLogger.getEntries();
    const entry = entries.find(e => e.id === logId);
    
    expect(entry).toBeDefined();
    expect(entry?.actor).toBe('Tester');
    expect(Object.isFrozen(entry)).toBe(true);
  });

  it('should execute subscriber notifications upon logging events', () => {
    const mockCallback = vi.fn();
    const unsubscribe = auditLogger.subscribe(mockCallback);

    auditLogger.log({
      actor: 'Operator A1',
      actorRole: 'operator',
      action: 'Trigger Playbook',
      resource: 'pb-102',
      resourceType: 'playbook',
      details: 'Halftime capacity warning bypass',
      result: 'success',
    });

    expect(mockCallback).toHaveBeenCalled();
    unsubscribe();
  });

  it('should filter log records correctly by actor roles', () => {
    auditLogger.log({
      actor: 'System Auto-cooling',
      actorRole: 'system',
      action: 'Modulate Vent',
      resource: 'zone-north',
      resourceType: 'hvac',
      details: 'Temp threshold breach cooling activation',
      result: 'success',
    });

    const systemLogs = auditLogger.getEntriesByRole('system');
    expect(systemLogs.length).toBeGreaterThan(0);
    expect(systemLogs.every(e => e.actorRole === 'system')).toBe(true);
  });

  it('should expose helper convenience APIs for actors', () => {
    const operatorId = auditLogger.logOperatorAction('Acknowledge Emergency', 'inc-102', 'Medical fall response');
    const systemId = auditLogger.logSystemAction('Scrub Deletion Cache', 'GDPR queue', 'Purge aggregate tokens');
    const fanId = auditLogger.logFanAction('Disable Proximity Location', 'privacy settings', 'Consent revoked');

    const entries = auditLogger.getEntries();
    expect(entries.find(e => e.id === operatorId)?.actorRole).toBe('operator');
    expect(entries.find(e => e.id === systemId)?.actorRole).toBe('system');
    expect(entries.find(e => e.id === fanId)?.actorRole).toBe('fan');
  });
});
