import { type ComponentType, memo } from 'react';
import { type LucideProps, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { sharedStyles } from '../../../styles/shared';

interface KPICardProps {
  label: string;
  value: string;
  previousValue?: string;
  percentChange?: number;
  trend?: number[];
  color?: string;
  icon: ComponentType<LucideProps>;
  unit?: string;
}

/**
 * Key Performance Indicator widget with real-time reactive sparklines.
 * Wrapped with memo to avoid dashboard tick re-render propagation.
 * Accessible with role="status" and complete screen-reader description text.
 */
export const KPICard = memo(function KPICard({
  label,
  value,
  percentChange,
  trend = [],
  color = '#3b82f6',
  icon: Icon,
  unit = '',
}: KPICardProps) {
  const isPositive = percentChange !== undefined && percentChange >= 0;
  
  // Format trend data into format Recharts expects
  const chartData = trend.map((v, i) => ({ index: i, value: v }));

  // Dynamic accessibility label describing current values and trends
  const ariaLabel = `${label}: ${value} ${unit}. ${
    percentChange !== undefined 
      ? `${isPositive ? 'Increased' : 'Decreased'} by ${Math.abs(percentChange)}%` 
      : ''
  }`;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      style={sharedStyles.kpiCard}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
        <div>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
          </span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9', marginTop: '6px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            {value}
            {unit && <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>{unit}</span>}
          </div>
        </div>
        
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: `${color}15`,
            border: `1px solid ${color}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-hidden="true"
        >
          <Icon size={20} color={color} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', zIndex: 1 }}>
        {percentChange !== undefined ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              fontWeight: 600,
              color: isPositive ? '#10b981' : '#ef4444',
              background: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              padding: '2px 8px',
              borderRadius: '6px',
            }}
            aria-hidden="true"
          >
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {isPositive ? '+' : ''}{percentChange}%
          </div>
        ) : (
          <div />
        )}

        {/* Mini Sparkline Chart */}
        {trend.length > 0 && (
          <div style={{ width: '80px', height: '30px' }} aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={1.5}
                  fill={`url(#grad-${label})`}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Subtle border accent */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: color,
          opacity: 0.3,
        }}
        aria-hidden="true"
      />
    </div>
  );
});

export default KPICard;
