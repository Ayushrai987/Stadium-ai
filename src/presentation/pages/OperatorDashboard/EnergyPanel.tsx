import { memo } from 'react';
import { Lightbulb } from 'lucide-react';
import { ProgressRing } from '../../components/common';
import { type EnergyMetrics } from '../../../types';

interface EnergyPanelProps {
  metrics: EnergyMetrics | null;
}

export const EnergyPanel = memo(function EnergyPanel({ metrics }: EnergyPanelProps) {
  return (
    <div className="col-4">
      <div style={{
        background: 'rgba(15,22,41,0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
      }} role="region" aria-label="Sustainability metrics statistics">
        <div style={{ width: '100%', textAlign: 'left', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#f1f5f9', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lightbulb size={16} color="#8b5cf6" aria-hidden="true" /> Sustainability KPIs
          </h3>
        </div>
        
        <ProgressRing
          value={metrics?.renewablePercentage || 35}
          size={110}
          strokeWidth={8}
          color="#8b5cf6"
          sublabel="Renewable Grid"
        />

        <div style={{ width: '100%', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <span>Carbon Reduction:</span>
            <span style={{ fontWeight: 600, color: '#10b981' }}>-{metrics?.baselineComparison || 40}% vs conventional</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <span>Carbon footprint:</span>
            <span style={{ fontWeight: 600 }}>{metrics?.carbonFootprint || 0} kg CO2</span>
          </div>
        </div>
      </div>
    </div>
  );
});
