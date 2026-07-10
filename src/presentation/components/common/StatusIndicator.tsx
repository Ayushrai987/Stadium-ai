import { memo } from 'react';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'degraded' | 'warning';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusIndicator = memo(function StatusIndicator({ status, label, size = 'md' }: StatusIndicatorProps) {
  const sizeMap = {
    sm: '6px',
    md: '8px',
    lg: '12px',
  };

  const colorMap = {
    online: '#10b981',
    offline: '#ef4444',
    degraded: '#f59e0b',
    warning: '#f97316',
  };

  const dotColor = colorMap[status] || colorMap.online;
  const dotSize = sizeMap[size];

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <div
        className={status === 'online' ? 'anim-pulse-glow' : ''}
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          backgroundColor: dotColor,
          boxShadow: `0 0 6px ${dotColor}80`,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      {label && (
        <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>
          {label}
        </span>
      )}
    </div>
  );
});
