import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVenueStore } from '../../../infrastructure/store/useVenueStore';
import { useIncidentStore } from '../../../infrastructure/store/useIncidentStore';
import { useShallow } from 'zustand/react/shallow';
import { ArrowLeft, Globe, ShieldAlert, CheckCircle2, Shield, Heart, Wrench, Bus, Send } from 'lucide-react';
import { TOURNAMENT_PLAYBOOKS } from '../../../constants';
import { validateStringInput } from '../../../infrastructure/security/InputSanitizer';
import { showToast } from '../../components/common';

interface ResourceTeam {
  id: string;
  name: string;
  type: 'medical' | 'security' | 'maintenance' | 'logistics';
  status: 'available' | 'deployed' | 'en-route' | 'busy';
  progress: number;
  currentVenue: string;
  targetVenue?: string;
  etaMinutes?: number;
}

/**
 * Tournament Operations Command Center page.
 * Cross-venue federation cockpit, incident command dashboard, playbook selectors,
 * and real-time operational resource allocator widgets.
 */
export function CommandCenter() {
  const navigate = useNavigate();
  const { venues } = useVenueStore(useShallow(state => ({ venues: state.venues })));
  const { incidents } = useIncidentStore(useShallow(state => ({ incidents: state.incidents })));

  const [selectedPlaybook, setSelectedPlaybook] = useState<string | null>(null);
  const [broadcastMsg, setBroadcastMsg] = useState('');

  const handleBroadcast = () => {
    const sanitized = validateStringInput(broadcastMsg, 200);
    if (!sanitized) {
      showToast('Invalid broadcast message.', 'error');
      return;
    }
    showToast(`Broadcast sent: ${sanitized}`, 'success');
    setBroadcastMsg('');
  };

  const activeIncidents = incidents.filter(i => i.status !== 'resolved' && i.status !== 'closed');

  // Hardcoded resource team registry for visual impact and telemetry demonstration
  const [resourceTeams] = useState<ResourceTeam[]>([
    { id: 'team-med-alpha', name: 'Medical Alpha Responders', type: 'medical', status: 'deployed', progress: 85, currentVenue: 'MetLife Stadium', targetVenue: 'MetLife East Gates', etaMinutes: 2 },
    { id: 'team-sec-one', name: 'Security Strike Team 1', type: 'security', status: 'en-route', progress: 45, currentVenue: 'SoFi Stadium', targetVenue: 'Azteca Stadium', etaMinutes: 12 },
    { id: 'team-maint-green', name: 'Eco-Maintenance Crew', type: 'maintenance', status: 'available', progress: 100, currentVenue: 'BMO Stadium' },
    { id: 'team-log-supply', name: 'Logistics Transport Unit B', type: 'logistics', status: 'busy', progress: 70, currentVenue: 'AT&T Stadium', targetVenue: 'MetLife Stadium', etaMinutes: 20 },
  ]);

  const handlePlaybookSelect = (id: string) => {
    setSelectedPlaybook(selectedPlaybook === id ? null : id);
  };

  const handlePlaybookKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePlaybookSelect(id);
    }
  };

  const getResourceIcon = (type: ResourceTeam['type']) => {
    switch (type) {
      case 'medical': return <Heart size={14} color="#ef4444" />;
      case 'security': return <Shield size={14} color="#3b82f6" />;
      case 'maintenance': return <Wrench size={14} color="#10b981" />;
      case 'logistics': return <Bus size={14} color="#f59e0b" />;
    }
  };

  const getStatusColor = (status: ResourceTeam['status']) => {
    switch (status) {
      case 'available': return '#10b981';
      case 'deployed': return '#ef4444';
      case 'en-route': return '#f59e0b';
      case 'busy': return '#8b5cf6';
    }
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
            <Globe size={22} color="#8b5cf6" aria-hidden="true" />
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Tournament Operations command</h1>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>FIFA WORLD CUP 2026 CENTRAL CONTROL</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }} role="status">
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', color: '#8b5cf6', fontWeight: 600 }}>
            {venues.length} Venues Federating
          </div>
        </div>
      </header>

      {/* Grid Content */}
      <main
        id="main-content"
        style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}
      >
        
        {/* Main federation overview card (8 columns) */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '24px' }} role="region" aria-label="Federation Telemetry and Resource Allocation">
          <div style={{
            background: 'rgba(15, 22, 41, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            padding: '24px',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#f1f5f9' }}>Cross-Venue Federation Telemetry</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} role="list" aria-label="Active Venues Telemetry">
              {venues.map((venue) => {
                const occupancyPercent = venue.capacity > 0 ? (venue.currentAttendance / venue.capacity) * 100 : 0;
                
                return (
                  <div
                    key={venue.id}
                    role="listitem"
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>{venue.name}</h3>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {venue.city}, {venue.country} · Compliance: {venue.regulatoryRegion}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700 }}>{Math.round(occupancyPercent)}%</div>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Occupancy</span>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700 }}>{venue.sensorHealth}%</div>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Sensors</span>
                      </div>

                      <div
                        role="progressbar"
                        aria-valuenow={Math.round(occupancyPercent)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${venue.name} occupancy percentage`}
                        style={{
                          width: '80px',
                          height: '6px',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}
                      >
                        <div style={{
                          width: `${occupancyPercent}%`,
                          height: '100%',
                          background: occupancyPercent > 85 ? '#ef4444' : '#10b981',
                        }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-Time Resource Allocation Section */}
          <div style={{
            background: 'rgba(15, 22, 41, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            padding: '24px',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#f1f5f9' }}>Staff & First Responder Allocation</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} role="list" aria-label="Responder Team Deployment Feeds">
              {resourceTeams.map((team) => (
                <div
                  key={team.id}
                  role="listitem"
                  style={{
                    background: 'rgba(255, 255, 255, 0.01)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '14px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getResourceIcon(team.type)}
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>{team.name}</span>
                    </div>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: getStatusColor(team.status),
                        background: `${getStatusColor(team.status)}15`,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {team.status.replace('-', ' ')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <span>Current Venue: <strong>{team.currentVenue}</strong></span>
                    {team.targetVenue && (
                      <span>Destination: <strong>{team.targetVenue}</strong> {team.etaMinutes && `(ETA ${team.etaMinutes}m)`}</span>
                    )}
                  </div>

                  {/* Operational Transit Status Progress */}
                  <div
                    role="progressbar"
                    aria-valuenow={team.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${team.name} deployment status progress`}
                    style={{
                      height: '5px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      width: '100%',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${team.progress}%`,
                        background: `linear-gradient(90deg, ${getStatusColor(team.status)}, #a78bfa)`,
                        borderRadius: '3px',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tournament playbooks list */}
          <div style={{
            background: 'rgba(15, 22, 41, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            padding: '24px',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#f1f5f9' }}>Incident Response playbooks</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} role="list" aria-label="Crisis Response Playbook Library">
              {TOURNAMENT_PLAYBOOKS.map(pb => {
                const isSelected = selectedPlaybook === pb.id;
                return (
                  <div
                    key={pb.id}
                    onClick={() => handlePlaybookSelect(pb.id)}
                    onKeyDown={(e) => handlePlaybookKeyDown(e, pb.id)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isSelected}
                    aria-label={`Playbook ${pb.name}. ${isSelected ? 'Selected. ' : ''}Description: ${pb.desc}`}
                    style={{
                      background: isSelected ? 'rgba(139, 92, 246, 0.05)' : 'rgba(255,255,255,0.01)',
                      border: `1px solid ${isSelected ? 'var(--info)' : 'var(--border)'}`,
                      borderRadius: '10px',
                      padding: '16px',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 6px', color: isSelected ? 'var(--info)' : '#f1f5f9' }}>
                      {pb.name}
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                      {pb.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Global Security / Active Incidents (4 columns) */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }} role="region" aria-label="Incident Alerts Panel">
          <div style={{
            background: 'rgba(15, 22, 41, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            padding: '24px',
            flex: 1,
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#f1f5f9' }}>
              <ShieldAlert size={18} color="#ef4444" aria-hidden="true" /> Active Federation Alerts
            </h2>

            <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={broadcastMsg}
                onChange={e => setBroadcastMsg(e.target.value)}
                placeholder="Broadcast global message..."
                aria-label="Global broadcast message input"
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border)',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '12px'
                }}
              />
              <button
                onClick={handleBroadcast}
                className="btn btn-primary"
                aria-label="Send global broadcast message"
                style={{ padding: '8px 12px' }}
              >
                <Send size={14} />
              </button>
            </div>

            <div
              role="log"
              aria-live="polite"
              aria-label="Active federation incident listings"
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              {activeIncidents.map(inc => (
                <div
                  key={inc.id}
                  style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    padding: '12px',
                    borderRadius: '8px',
                  }}
                >
                  <h3 style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 4px', color: '#ef4444' }}>{inc.title}</h3>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                    {inc.description}
                  </p>
                </div>
              ))}

              {activeIncidents.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }} role="status" aria-live="polite">
                  <CheckCircle2 size={32} color="#10b981" style={{ marginBottom: '8px' }} aria-hidden="true" />
                  <span style={{ fontSize: '12px' }}>No active alerts across venues</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default CommandCenter;
