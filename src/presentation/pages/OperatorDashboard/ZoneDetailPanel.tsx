import { memo } from 'react';
import { Thermometer, Wind, Clock, Zap } from 'lucide-react';
import { MetricChart } from '../../components/common';
import { type Zone } from '../../../types';
import { sharedStyles } from '../../../styles/shared';

interface ZoneDetailPanelProps {
  zone: Zone;
  onClose: () => void;
  chartData: { time: string; value: number }[];
}

export const ZoneDetailPanel = memo(function ZoneDetailPanel({
  zone,
  onClose,
  chartData,
}: ZoneDetailPanelProps) {
  return (
    <div className="col-8 anim-slide-in" role="region" aria-label={`Details for zone ${zone.name}`}>
      <div style={sharedStyles.glassPanel}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9', margin: 0 }}>
              Zone details: {zone.name}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Capacity: {zone.capacity} · Occupancy: {zone.currentOccupancy}
            </span>
          </div>
          <button
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={onClose}
            aria-label={`Close detailed statistics panel for zone ${zone.name}`}
          >
            Close Zone Detail
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }} role="list" aria-label="Zone environment parameters">
          <div style={sharedStyles.lightPanelItem} role="listitem">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontSize: '12px', marginBottom: '4px' }}>
              <Thermometer size={14} aria-hidden="true" /> Temp
            </div>
            <span style={{ fontSize: '18px', fontWeight: 700 }}>{zone.temperature}°F</span>
          </div>
          
          <div style={sharedStyles.lightPanelItem} role="listitem">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '12px', marginBottom: '4px' }}>
              <Wind size={14} aria-hidden="true" /> Air Quality
            </div>
            <span style={{ fontSize: '18px', fontWeight: 700 }}>{zone.airQuality} AQI</span>
          </div>
          
          <div style={sharedStyles.lightPanelItem} role="listitem">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3b82f6', fontSize: '12px', marginBottom: '4px' }}>
              <Clock size={14} aria-hidden="true" /> Queue Time
            </div>
            <span style={{ fontSize: '18px', fontWeight: 700 }}>{zone.queueTime} min</span>
          </div>
          
          <div style={sharedStyles.lightPanelItem} role="listitem">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8b5cf6', fontSize: '12px', marginBottom: '4px' }}>
              <Zap size={14} aria-hidden="true" /> HVAC Energy
            </div>
            <span style={{ fontSize: '18px', fontWeight: 700 }}>{zone.energyUsage} kWh</span>
          </div>
        </div>

        {chartData.length > 0 ? (
          <div aria-hidden="true">
            <MetricChart data={chartData} color="#3b82f6" title="Occupancy trend % (last 50s)" />
          </div>
        ) : (
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }} role="status">
            Wait for simulation ticks to generate history chart...
          </div>
        )}
      </div>
    </div>
  );
});
