import { memo } from 'react';
import { type AlertSeverity } from '../../../types';

interface AlertBadgeProps {
  severity: AlertSeverity;
  text?: string;
  pulse?: boolean;
}

export const AlertBadge = memo(function AlertBadge({ severity, text, pulse = false }: AlertBadgeProps) {
  const label = text || severity;

  const styles: Record<AlertSeverity, { bg: string; color: string; border: string }> = {
    info: {
      bg: 'rgba(59, 130, 246, 0.1)',
      color: '#3b82f6',
      border: 'rgba(59, 130, 246, 0.2)',
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.1)',
      color: '#f59e0b',
      border: 'rgba(245, 158, 11, 0.2)',
    },
    critical: {
      bg: 'rgba(239, 68, 68, 0.1)',
      color: '#ef4444',
      border: 'rgba(239, 68, 68, 0.2)',
    },
    emergency: {
      bg: 'rgba(239, 68, 68, 0.15)',
      color: '#ef4444',
      border: 'rgba(239, 68, 68, 0.3)',
    },
  };

  const currentStyle = styles[severity] || styles.info;

  return (
    <span
      className={pulse || severity === 'emergency' ? 'anim-pulse-danger' : ''}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 8px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: 600,
        background: currentStyle.bg,
        color: currentStyle.color,
        border: `1px solid ${currentStyle.border}`,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        width: 'fit-content',
      }}
    >
      {(severity === 'critical' || severity === 'emergency') && (
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#ef4444',
          display: 'inline-block',
        }} />
      )}
      {label}
    </span>
  );
});
