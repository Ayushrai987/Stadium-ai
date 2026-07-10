import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KPICard } from '../../presentation/components/common/KPICard';
import { Users } from 'lucide-react';

// Mock Recharts to avoid jsdom responsive container layout issues
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AreaChart: ({ children }: { children: React.ReactNode }) => <svg>{children}</svg>,
  Area: () => <path />,
}));

describe('KPICard Component', () => {
  it('should render label value unit and accessibility tags correctly', () => {
    render(
      <KPICard
        label="Live Attendance"
        value="45,200"
        unit="/ 82,500"
        percentChange={55}
        icon={Users}
        color="#3b82f6"
      />
    );

    // Assert visible elements
    expect(screen.getByText('Live Attendance')).toBeInTheDocument();
    expect(screen.getByText('45,200')).toBeInTheDocument();
    expect(screen.getByText('/ 82,500')).toBeInTheDocument();

    // Assert accessibility features
    const cardElement = screen.getByRole('status');
    expect(cardElement).toBeInTheDocument();
    expect(cardElement).toHaveAttribute('aria-live', 'polite');
    expect(cardElement).toHaveAttribute('aria-label', 'Live Attendance: 45,200 / 82,500. Increased by 55%');
  });

  it('should format labels correctly for negative percentage changes', () => {
    render(
      <KPICard
        label="Energy Savings"
        value="12.4"
        unit="kWh"
        percentChange={-8}
        icon={Users}
      />
    );

    const cardElement = screen.getByRole('status');
    expect(cardElement).toHaveAttribute('aria-label', 'Energy Savings: 12.4 kWh. Decreased by 8%');
  });
});
