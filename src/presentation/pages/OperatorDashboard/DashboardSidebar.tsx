import { memo, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity } from 'lucide-react';
import { StatusIndicator } from '../../components/common';
import { type Venue } from '../../../types';

interface DashboardSidebarProps {
  venues: Venue[];
  selectedVenueId: string;
  sensorStats: {
    total: number;
    online: number;
    healthPercent: number;
  };
  onVenueSelect: (id: string) => void;
}

export const DashboardSidebar = memo(function DashboardSidebar({
  venues,
  selectedVenueId,
  sensorStats,
  onVenueSelect,
}: DashboardSidebarProps) {
  const navigate = useNavigate();

  const handleVenueKeyDown = (e: KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onVenueSelect(id);
    }
  };

  return (
    <aside className="dashboard-sidebar" role="navigation" aria-label="Operations Navigation Sidebar">
      <div className="dashboard-sidebar-header">
        <button
          onClick={() => navigate('/')}
          aria-label="Exit dashboard and return to selections portal"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
        <div role="presentation">
          <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#f1f5f9' }}>StadiumAI</h2>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>OPERATOR COMMAND</span>
        </div>
      </div>

      <div className="dashboard-sidebar-nav" role="tablist" aria-label="Connected Venues Navigation">
        <div className="sidebar-nav-item active" role="tab" aria-selected="true" aria-label="Command Center overview selected">
          <Activity size={18} aria-hidden="true" />
          Command Center
        </div>
        
        <div style={{ margin: '16px 0 8px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', paddingLeft: '16px' }} role="presentation">
          Connected Venues
        </div>
        {venues.map((venue) => {
          const isSelected = selectedVenueId === venue.id;
          return (
            <div
              key={venue.id}
              role="tab"
              aria-selected={isSelected}
              tabIndex={0}
              onClick={() => onVenueSelect(venue.id)}
              onKeyDown={(e) => handleVenueKeyDown(e, venue.id)}
              className={`sidebar-nav-item ${isSelected ? 'active' : ''}`}
              style={{ paddingLeft: '24px' }}
              aria-label={`Switch view to ${venue.name}. ${venue.city}, ${venue.country}`}
            >
              {venue.name}
            </div>
          );
        })}
      </div>

      <div style={{ padding: '24px', borderTop: '1px solid var(--border)' }} role="status">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <StatusIndicator status={sensorStats.healthPercent > 90 ? 'online' : 'degraded'} />
          <span style={{ fontSize: '12px', fontWeight: 600 }}>Sensor Network</span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          {sensorStats.online} / {sensorStats.total} Online ({sensorStats.healthPercent}%)
        </span>
      </div>
    </aside>
  );
});
