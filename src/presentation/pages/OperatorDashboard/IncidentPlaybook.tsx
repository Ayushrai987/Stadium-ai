import { memo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { type Incident } from '../../../types';
import { sharedStyles } from '../../../styles/shared';

interface IncidentPlaybookProps {
  incident: Incident;
  onDeselect: () => void;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}

export const IncidentPlaybook = memo(function IncidentPlaybook({
  incident,
  onDeselect,
  onAcknowledge,
  onResolve,
}: IncidentPlaybookProps) {
  return (
    <div className="col-4 anim-slide-in" role="region" aria-label={`Playbook for incident ${incident.title}`}>
      <div style={sharedStyles.dangerPanel}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#ef4444', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} aria-hidden="true" /> Active Response Playbook
            </h4>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ID: {incident.id}</span>
          </div>
          <button
            onClick={onDeselect}
            aria-label="Deselect active incident response playbook view"
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '11px' }}
          >
            Deselect
          </button>
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#f1f5f9', margin: '0 0 8px' }}>{incident.title}</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 16px' }}>
          {incident.description}
        </p>

        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }} role="presentation">
            Audit Decision Trail
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }} role="log" aria-label="Incident decision audit logs">
            {incident.decisionAuditTrail.map((audit, idx) => (
              <div key={idx} style={{ fontSize: '11px', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontWeight: 600, marginBottom: '2px' }}>
                  <span>{audit.decision}</span>
                  <span style={{ color: '#3b82f6', textTransform: 'uppercase' }}>{audit.madeBy}</span>
                </div>
                <span style={{ color: 'var(--text-muted)' }}>Rationale: {audit.rationale}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {incident.status === 'detected' && (
            <button
              className="btn btn-primary"
              style={{ flex: 1, padding: '8px 0', fontSize: '12px' }}
              onClick={() => onAcknowledge(incident.id)}
              aria-label={`Acknowledge incident and deploy operational playbooks for ${incident.title}`}
            >
              Acknowledge & Deploy Playbook
            </button>
          )}
          {incident.status === 'responding' && (
            <button
              className="btn btn-primary"
              style={{ flex: 1, padding: '8px 0', fontSize: '12px', background: '#10b981' }}
              onClick={() => onResolve(incident.id)}
              aria-label={`Mark situation resolved for ${incident.title}`}
            >
              Mark Situation Resolved
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
