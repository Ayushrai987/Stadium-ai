import { motion } from 'framer-motion';
import { type Zone } from '../../../types';

interface StadiumHeatmapProps {
  zones: Zone[];
  onZoneClick?: (zone: Zone) => void;
  selectedZoneId?: string;
}

function getHeatColor(percent: number): string {
  if (percent < 40) return '#10b981';
  if (percent < 60) return '#22d3ee';
  if (percent < 75) return '#f59e0b';
  if (percent < 90) return '#f97316';
  return '#ef4444';
}

function getHeatOpacity(percent: number): number {
  return 0.3 + (percent / 100) * 0.55;
}

/**
 * Interactive SVG stadium heatmap showing real-time crowd density.
 * Fully keyboard accessible and screen-reader compliant.
 */
export function StadiumHeatmap({ zones, onZoneClick, selectedZoneId }: StadiumHeatmapProps) {
  // Stadium layout definition - positions are relative to SVG viewBox
  const zoneLayout: Record<string, { path: string; labelPos: { x: number; y: number }; label: string }> = {
    'zone-north-upper': {
      path: 'M 150 30 Q 400 0 650 30 L 620 70 Q 400 45 180 70 Z',
      labelPos: { x: 400, y: 50 },
      label: 'North Upper',
    },
    'zone-north-lower': {
      path: 'M 180 70 Q 400 45 620 70 L 590 115 Q 400 90 210 115 Z',
      labelPos: { x: 400, y: 93 },
      label: 'North Lower',
    },
    'zone-south-upper': {
      path: 'M 150 430 Q 400 460 650 430 L 620 390 Q 400 415 180 390 Z',
      labelPos: { x: 400, y: 415 },
      label: 'South Upper',
    },
    'zone-south-lower': {
      path: 'M 180 390 Q 400 415 620 390 L 590 345 Q 400 370 210 345 Z',
      labelPos: { x: 400, y: 370 },
      label: 'South Lower',
    },
    'zone-east-upper': {
      path: 'M 650 30 L 750 100 L 750 360 L 650 430 L 620 390 L 700 330 L 700 130 L 620 70 Z',
      labelPos: { x: 700, y: 230 },
      label: 'East',
    },
    'zone-west-upper': {
      path: 'M 150 30 L 50 100 L 50 360 L 150 430 L 180 390 L 100 330 L 100 130 L 180 70 Z',
      labelPos: { x: 100, y: 230 },
      label: 'West',
    },
    'zone-ne-concourse': {
      path: 'M 620 70 L 700 130 L 660 155 L 590 115 Z',
      labelPos: { x: 640, y: 118 },
      label: 'NE',
    },
    'zone-nw-concourse': {
      path: 'M 180 70 L 100 130 L 140 155 L 210 115 Z',
      labelPos: { x: 160, y: 118 },
      label: 'NW',
    },
    'zone-se-concourse': {
      path: 'M 620 390 L 700 330 L 660 305 L 590 345 Z',
      labelPos: { x: 640, y: 345 },
      label: 'SE',
    },
    'zone-sw-concourse': {
      path: 'M 180 390 L 100 330 L 140 305 L 210 345 Z',
      labelPos: { x: 160, y: 345 },
      label: 'SW',
    },
    'zone-concession-north': {
      path: 'M 280 120 L 520 120 L 510 145 L 290 145 Z',
      labelPos: { x: 400, y: 133 },
      label: '🍕 Concession N',
    },
    'zone-concession-south': {
      path: 'M 280 340 L 520 340 L 510 315 L 290 315 Z',
      labelPos: { x: 400, y: 328 },
      label: '🍕 Concession S',
    },
  };

  // Map zones to layout
  const mappedZones = zones.slice(0, Object.keys(zoneLayout).length).map((zone, idx) => {
    const layoutKeys = Object.keys(zoneLayout);
    const layoutKey = layoutKeys[idx] || layoutKeys[0];
    const layout = zoneLayout[layoutKey];
    const occupancyPercent = zone.capacity > 0 ? (zone.currentOccupancy / zone.capacity) * 100 : 0;
    return { zone, layout, layoutKey, occupancyPercent };
  });

  const handleKeyDown = (e: React.KeyboardEvent, zone: Zone) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onZoneClick?.(zone);
    }
  };

  return (
    <div
      role="region"
      aria-label="Stadium Heatmap Visualization"
      style={{
        background: 'rgba(15, 22, 41, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        padding: '24px',
        position: 'relative',
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
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#f1f5f9', margin: 0 }}>
            Live Stadium Heatmap
          </h3>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0' }}>
            Real-time crowd density by zone (Interactive)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }} aria-hidden="true">
          {[
            { color: '#10b981', label: '<40%' },
            { color: '#22d3ee', label: '40-60%' },
            { color: '#f59e0b', label: '60-75%' },
            { color: '#f97316', label: '75-90%' },
            { color: '#ef4444', label: '>90%' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: color }} />
              <span style={{ fontSize: '10px', color: '#64748b' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <svg
        viewBox="0 0 800 460"
        style={{ width: '100%', height: 'auto' }}
        role="img"
        aria-label="Stadium Layout Map. Contains interactive zones displaying crowd percentage. Select a zone to view details."
      >
        <title>Live Stadium Heatmap</title>
        <desc>
          A visual representation of the stadium zones. Green indicates low occupancy, yellow indicates moderate, and red indicates high occupancy.
        </desc>

        {/* Background glow */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="fieldGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.03" />
          </radialGradient>
        </defs>

        {/* Playing field */}
        <rect x="210" y="155" width="380" height="150" rx="8" fill="url(#fieldGrad)" stroke="#10b981" strokeOpacity="0.2" strokeWidth="1" />
        {/* Center circle */}
        <circle cx="400" cy="230" r="30" fill="none" stroke="#10b981" strokeOpacity="0.15" strokeWidth="1" />
        <line x1="400" y1="155" x2="400" y2="305" stroke="#10b981" strokeOpacity="0.1" strokeWidth="1" />
        {/* Goal areas */}
        <rect x="210" y="195" width="40" height="70" rx="2" fill="none" stroke="#10b981" strokeOpacity="0.1" strokeWidth="1" />
        <rect x="550" y="195" width="40" height="70" rx="2" fill="none" stroke="#10b981" strokeOpacity="0.1" strokeWidth="1" />

        {/* Field label */}
        <text x="400" y="235" textAnchor="middle" fill="#10b981" fillOpacity="0.3" fontSize="12" fontWeight="600" fontFamily="Inter">
          FIELD
        </text>

        {/* Zone sections */}
        {mappedZones.map(({ zone, layout, layoutKey, occupancyPercent }) => {
          const isSelected = zone.id === selectedZoneId;
          const statusText = `Zone ${layout.label}: ${Math.round(occupancyPercent)}% occupancy. ${zone.queueTime} minute queue time. ${isSelected ? 'Selected.' : 'Select for details.'}`;
          return (
            <motion.g
              key={layoutKey}
              whileHover={{ scale: 1.02 }}
              style={{ cursor: 'pointer' }}
              onClick={() => onZoneClick?.(zone)}
              onKeyDown={(e) => handleKeyDown(e, zone)}
              tabIndex={0}
              role="button"
              aria-label={statusText}
            >
              <motion.path
                d={layout.path}
                fill={getHeatColor(occupancyPercent)}
                fillOpacity={getHeatOpacity(occupancyPercent)}
                stroke={isSelected ? '#ffffff' : getHeatColor(occupancyPercent)}
                strokeWidth={isSelected ? 2 : 0.5}
                strokeOpacity={isSelected ? 0.8 : 0.4}
                initial={{ fillOpacity: 0 }}
                animate={{ fillOpacity: getHeatOpacity(occupancyPercent) }}
                transition={{ duration: 0.5 }}
                filter={occupancyPercent > 85 ? 'url(#glow)' : undefined}
              />
              <text
                x={layout.labelPos.x}
                y={layout.labelPos.y - 6}
                textAnchor="middle"
                fill="#f1f5f9"
                fontSize="9"
                fontWeight="600"
                fontFamily="Inter"
                pointerEvents="none"
              >
                {layout.label}
              </text>
              <text
                x={layout.labelPos.x}
                y={layout.labelPos.y + 8}
                textAnchor="middle"
                fill="#f1f5f9"
                fontSize="11"
                fontWeight="700"
                fontFamily="Inter"
                pointerEvents="none"
              >
                {Math.round(occupancyPercent)}%
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

export default StadiumHeatmap;
