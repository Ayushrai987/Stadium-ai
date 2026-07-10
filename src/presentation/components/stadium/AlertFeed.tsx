import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  ShieldAlert,
  Heart,
  Flame,
  CloudLightning,
  Zap,
  Users,
  Cpu,
  Check,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { type Incident, type AlertSeverity } from '../../../types';

interface AlertFeedProps {
  incidents: Incident[];
  onIncidentClick?: (incident: Incident) => void;
  onAcknowledge?: (incidentId: string) => void;
  maxItems?: number;
}

const severityConfig: Record<AlertSeverity, { color: string; bg: string; border: string }> = {
  info: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
  warning: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
  emergency: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)' },
};

const incidentIcons: Record<string, typeof AlertTriangle> = {
  medical: Heart,
  security: ShieldAlert,
  fire: Flame,
  weather: CloudLightning,
  'power-outage': Zap,
  'crowd-surge': Users,
  'equipment-failure': Cpu,
  cyber: ShieldAlert,
};

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'detected': return '#f59e0b';
    case 'alerting': return '#f97316';
    case 'responding': return '#3b82f6';
    case 'in-progress': return '#8b5cf6';
    case 'resolved': return '#10b981';
    case 'closed': return '#64748b';
    default: return '#94a3b8';
  }
}

/**
 * Real-time dynamic incident alert feed dashboard module.
 * Responsive component with visual timers, status tags, and accessibility hooks.
 */
export function AlertFeed({ incidents, onIncidentClick, onAcknowledge, maxItems = 8 }: AlertFeedProps) {
  const displayIncidents = incidents.slice(0, maxItems);

  const handleKeyDown = (e: React.KeyboardEvent, incident: Incident) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onIncidentClick?.(incident);
    }
  };

  return (
    <div
      role="region"
      aria-label="Incident Management Logs"
      style={{
        background: 'rgba(15, 22, 41, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        padding: '20px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle size={18} color="#f59e0b" aria-hidden="true" />
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#f1f5f9', margin: 0 }}>
            Live Alerts
          </h3>
          {incidents.filter(i => i.status !== 'resolved' && i.status !== 'closed').length > 0 && (
            <span
              role="status"
              aria-live="polite"
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#ef4444',
                background: 'rgba(239,68,68,0.15)',
                padding: '2px 8px',
                borderRadius: '10px',
                animation: 'pulse 2s infinite',
              }}
            >
              {incidents.filter(i => i.status !== 'resolved' && i.status !== 'closed').length} Active
            </span>
          )}
        </div>
      </div>

      <div
        role="log"
        aria-live="polite"
        aria-label="Active emergency notifications feed"
        style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}
      >
        <AnimatePresence mode="popLayout">
          {displayIncidents.map((incident) => {
            const config = severityConfig[incident.severity];
            const IconComp = incidentIcons[incident.type] || AlertTriangle;
            const isEmergency = incident.severity === 'emergency';
            
            return (
              <motion.div
                key={incident.id}
                layout
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => onIncidentClick?.(incident)}
                onKeyDown={(e) => handleKeyDown(e, incident)}
                tabIndex={0}
                role="button"
                aria-label={`Incident ${incident.title} at ${incident.location}. Status: ${incident.status}, Severity: ${incident.severity}. Details: ${incident.description}`}
                style={{
                  background: config.bg,
                  border: `1px solid ${config.border}`,
                  borderRadius: '10px',
                  padding: '12px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: isEmergency ? 'pulse 1.5s infinite' : undefined,
                }}
              >
                {/* Left severity stripe */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '3px',
                  background: config.color,
                  borderRadius: '3px 0 0 3px',
                }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', paddingLeft: '6px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: config.bg,
                    border: `1px solid ${config.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <IconComp size={16} color={config.color} aria-hidden="true" />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#f1f5f9',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {incident.title}
                      </span>
                      <span style={{ fontSize: '10px', color: '#64748b', flexShrink: 0, marginLeft: '8px' }}>
                        {timeAgo(incident.detectedAt)}
                      </span>
                    </div>

                    <p style={{
                      fontSize: '11px',
                      color: '#94a3b8',
                      margin: '0 0 8px',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {incident.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Status badge */}
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          color: getStatusColor(incident.status),
                          background: `${getStatusColor(incident.status)}15`,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}>
                          <Clock size={10} aria-hidden="true" />
                          {incident.status}
                        </span>

                        {/* Location */}
                        <span style={{ fontSize: '10px', color: '#64748b' }}>
                          {incident.location}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '4px' }}>
                        {incident.status === 'detected' && onAcknowledge && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAcknowledge(incident.id);
                            }}
                            aria-label={`Acknowledge incident ${incident.title}`}
                            style={{
                              background: 'rgba(16,185,129,0.15)',
                              border: '1px solid rgba(16,185,129,0.3)',
                              borderRadius: '6px',
                              padding: '3px 8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '10px',
                              color: '#10b981',
                              fontWeight: 500,
                            }}
                          >
                            <Check size={10} aria-hidden="true" /> ACK
                          </button>
                        )}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          color: '#64748b',
                        }}>
                          <ChevronRight size={14} aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {displayIncidents.length === 0 && (
          <div
            role="status"
            aria-live="polite"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 0',
              color: '#64748b',
            }}
          >
            <Check size={24} style={{ marginBottom: '8px' }} aria-hidden="true" />
            <span style={{ fontSize: '13px' }}>All clear — no active alerts</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlertFeed;
