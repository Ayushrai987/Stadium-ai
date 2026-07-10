import { memo, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { VisuallyHidden } from './VisuallyHidden';

interface MetricChartProps {
  data: { time: string; value: number }[];
  color?: string;
  title?: string;
  height?: number;
  showGrid?: boolean;
}

/**
 * Reusable dark-themed area chart with high-performance memoization
 * and accessible tabular fallback for screen readers.
 */
export const MetricChart = memo(function MetricChart({
  data,
  color = '#3b82f6',
  title,
  height = 200,
  showGrid = true,
}: MetricChartProps) {
  // Compute basic trend statistics for screen reader summaries
  const dataSummary = useMemo(() => {
    if (!data.length) return 'No data available.';
    const values = data.map(d => d.value);
    const startVal = values[0];
    const endVal = values[values.length - 1];
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const trend = endVal > startVal ? 'upward' : endVal < startVal ? 'downward' : 'stable';
    
    return `Chart: ${title || 'Metric Trend'}. Showing ${data.length} points with an overall ${trend} trend. Starting at ${startVal}, ending at ${endVal}. Min value: ${minVal}, Max value: ${maxVal}.`;
  }, [data, title]);

  return (
    <div 
      style={{
        width: '100%',
        height: `${height}px`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {title && (
        <span style={{
          fontSize: '12px',
          color: '#64748b',
          fontWeight: 600,
          marginBottom: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {title}
        </span>
      )}
      
      {/* Chart container with ARIA tags */}
      <div 
        style={{ flex: 1, minHeight: 0 }}
        role="img"
        aria-label={dataSummary}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-chart-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />}
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(15, 22, 41, 0.9)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '11px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              }}
              labelStyle={{ color: '#94a3b8', fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#grad-chart-${color})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Screen reader accessible data table fallback */}
      <VisuallyHidden>
        <table aria-label={`${title || 'Metric'} Data Table`}>
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((point, idx) => (
              <tr key={idx}>
                <td>{point.time}</td>
                <td>{point.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </VisuallyHidden>
    </div>
  );
});

export default MetricChart;
