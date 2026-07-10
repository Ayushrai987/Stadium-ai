import { memo } from 'react';

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

/**
 * Custom SVG progress ring indicator.
 * Fully accessible with role="progressbar" and appropriate bounding markers.
 */
export const ProgressRing = memo(function ProgressRing({
  value,
  size = 120,
  strokeWidth = 10,
  color,
  label,
  sublabel,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  // Determine color based on threshold value if not specified
  const ringColor =
    color ||
    (value < 60 ? '#10b981' : value < 85 ? '#f59e0b' : '#ef4444');

  const accessibilityLabel = label || sublabel || 'Progress percentage';

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${accessibilityLabel}: ${Math.round(value)}%`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} aria-hidden="true">
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease-out, stroke 0.3s ease' }}
        />
      </svg>
      
      {/* Center Text overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-hidden="true"
      >
        <span style={{ fontSize: '22px', fontWeight: 700, color: '#f1f5f9' }}>
          {Math.round(value)}%
        </span>
        {sublabel && (
          <span style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
            {sublabel}
          </span>
        )}
      </div>
      
      {label && (
        <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500, marginTop: '12px' }} aria-hidden="true">
          {label}
        </span>
      )}
    </div>
  );
});
export default ProgressRing;
