import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle, Trash2 } from 'lucide-react';
import { showToast, ConfirmDialog } from '../../components/common';
import { SAMPLE_AUDIT_LOGS } from '../../../constants';

interface PendingDeletion {
  id: string;
  fanId: string;
  requestTime: string;
  status: string;
}

/**
 * Privacy and Data Compliance Center control panel.
 * Regulatory logs display, data classification indexes, and GDPR Right to be Forgotten deletion triggers.
 */
export function PrivacyCenter() {
  const navigate = useNavigate();

  const [pendingDeletions, setPendingDeletions] = useState<PendingDeletion[]>([
    { id: 'del-883', fanId: 'fan-0932', requestTime: '10 min ago', status: 'Pending Verification' },
    { id: 'del-884', fanId: 'fan-1194', requestTime: '2 hours ago', status: 'Processing' },
  ]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const requestDeleteApproval = (id: string) => {
    setDeleteTargetId(id);
    setShowConfirm(true);
  };

  const executeDelete = () => {
    if (deleteTargetId) {
      setPendingDeletions(prev => prev.filter(p => p.id !== deleteTargetId));
      showToast('User personal profiles deleted successfully. All edge and cache directories scrubbed.', 'success');
    }
    setShowConfirm(false);
    setDeleteTargetId(null);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteTargetId(null);
  };

  const getTargetFanId = () => {
    const item = pendingDeletions.find(p => p.id === deleteTargetId);
    return item ? item.fanId : '';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', color: '#f1f5f9' }}>
      {/* Top Header */}
      <header
        role="banner"
        style={{
          height: '70px',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(10, 14, 26, 0.8)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/')}
            aria-label="Back to main selections portal"
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={22} color="#f59e0b" aria-hidden="true" />
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Privacy & Compliance Center</h1>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>REGULATORY CONTROL PANEL</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content grid */}
      <main
        id="main-content"
        style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}
      >
        
        {/* Compliance details (8 columns) */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '24px' }} role="region" aria-label="Privacy Matrix and Access logs">
          <div style={{
            background: 'rgba(15, 22, 41, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            padding: '24px',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#f1f5f9' }}>Data Classification Matrix</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} role="list" aria-label="Data categories rules">
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border)' }} role="listitem">
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>🟢 PUBLIC AGGREGATED</span>
                <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '4px 0 6px' }}>Zone Crowd Density</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  Sent to command dashboards. Individual IDs are entirely stripped. GDPR/CCPA compliant.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border)' }} role="listitem">
                <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600 }}>🟡 SENSITIVE PERSONAL</span>
                <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '4px 0 6px' }}>On-Device Preferences</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  Stored strictly inside the fan's mobile device storage. Never uploads to cloud databases.
                </p>
              </div>
            </div>
          </div>

          {/* Tamper proof audit log */}
          <div style={{
            background: 'rgba(15, 22, 41, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            padding: '24px',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#f1f5f9' }}>Data Access Audit Log</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} role="log" aria-label="Privacy audits logs feed">
              {SAMPLE_AUDIT_LOGS.map((log, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{log.time}</span>
                    <span style={{ fontWeight: 600 }}>{log.actor}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{log.action}</span>
                  </div>
                  <span
                    role="status"
                    aria-live="polite"
                    style={{
                      color: log.status.startsWith('Approved') ? '#10b981' : '#ef4444',
                      fontWeight: 600,
                    }}
                  >
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Right to be Forgotten requests (4 columns) */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }} role="region" aria-label="GDPR Right to be Forgotten Queue">
          <div style={{
            background: 'rgba(15, 22, 41, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            padding: '24px',
            flex: 1,
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#f1f5f9' }}>
              <Trash2 size={18} color="#ef4444" aria-hidden="true" /> Right to be Forgotten (GDPR)
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} role="list" aria-label="GDPR deletion requests list">
              {pendingDeletions.map(del => (
                <div
                  key={del.id}
                  role="listitem"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border)',
                    padding: '14px',
                    borderRadius: '10px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{del.fanId}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{del.requestTime}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600 }}>{del.status}</span>
                    <button
                      onClick={() => requestDeleteApproval(del.id)}
                      aria-label={`Approve data deletion for ${del.fanId}`}
                      style={{
                        background: 'rgba(239,68,68,0.15)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        color: '#ef4444',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Approve deletion
                    </button>
                  </div>
                </div>
              ))}

              {pendingDeletions.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }} role="status" aria-live="polite">
                  <CheckCircle size={32} color="#10b981" style={{ marginBottom: '8px' }} aria-hidden="true" />
                  <span style={{ fontSize: '12px' }}>All deletion queues clear</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* Accessible Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        title="Confirm Data Scrubbing Action"
        message={`Are you sure you want to permanently delete all data records for ${getTargetFanId()}? This will erase their profile coordinates, concesion purchase records, and device cache maps across the network.`}
        confirmLabel="scrub & delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={executeDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default PrivacyCenter;
