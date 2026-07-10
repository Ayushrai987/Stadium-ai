import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { OperatorDashboard } from '../../presentation/pages/OperatorDashboard/OperatorDashboard';
import { useVenueStore } from '../../infrastructure/store/useVenueStore';
import { useIncidentStore } from '../../infrastructure/store/useIncidentStore';
import { useKPIStore } from '../../infrastructure/store/useKPIStore';
import { useCrowdStore } from '../../infrastructure/store/useCrowdStore';
import { useEnergyStore } from '../../infrastructure/store/useEnergyStore';
import { useSimulationStore } from '../../infrastructure/store/useSimulationStore';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Recharts to avoid jsdom layout errors
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AreaChart: ({ children }: { children: React.ReactNode }) => <svg data-testid="area-chart">{children}</svg>,
  Area: () => <path />,
  XAxis: () => <g />,
  YAxis: () => <g />,
  Tooltip: () => <div />,
  CartesianGrid: () => <g />,
  BarChart: ({ children }: { children: React.ReactNode }) => <svg data-testid="bar-chart">{children}</svg>,
  Bar: () => <rect />,
}));

describe('OperatorDashboard Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    // Initialize states to known baseline
    useVenueStore.setState({
      selectedVenueId: 'venue-metlife',
      venues: [
        {
          id: 'venue-metlife',
          name: 'MetLife Stadium',
          city: 'East Rutherford',
          country: 'USA',
          capacity: 80000,
          currentAttendance: 45000,
          sensorHealth: 98,
          regulatoryRegion: 'NJ-EPA',
          zones: [
            {
              id: 'zone-north-upper',
              name: 'North Upper Stand',
              type: 'seating',
              capacity: 10000,
              currentOccupancy: 5000,
              temperature: 72,
              airQuality: 45,
              queueTime: 5,
              energyUsage: 120,
              sensors: [
                { id: 's1', type: 'occupancy', status: 'online', battery: 85, lastUpdated: Date.now() },
              ],
            },
          ],
        },
        {
          id: 'venue-sofi',
          name: 'SoFi Stadium',
          city: 'Inglewood',
          country: 'USA',
          capacity: 70000,
          currentAttendance: 35000,
          sensorHealth: 95,
          regulatoryRegion: 'CA-AQMD',
          zones: [
            {
              id: 'zone-south-lower',
              name: 'South Lower Stand',
              type: 'seating',
              capacity: 8000,
              currentOccupancy: 4000,
              temperature: 70,
              airQuality: 35,
              queueTime: 2,
              energyUsage: 100,
              sensors: [],
            },
          ],
        },
      ],
    });

    useIncidentStore.setState({
      incidents: [
        {
          id: 'inc-1',
          venueId: 'venue-metlife',
          zoneId: 'zone-north-upper',
          type: 'medical',
          severity: 'critical',
          status: 'detected',
          title: 'Emergency Fall',
          description: 'A fan slipped and fell near Row B.',
          assignedTo: null,
          location: 'Section 102, Row B',
          detectedAt: Date.now() - 30000,
          decisionAuditTrail: [
            { timestamp: Date.now() - 30000, decision: 'Incident detected by AI camera', madeBy: 'System Classifier', rationale: 'High fall confidence score' },
          ],
        },
      ],
      activeIncidentId: null,
    });

    useKPIStore.setState({
      kpis: {
        queueTimeReduction: { before: 18, after: 12, percentChange: -33.3 },
        revenueLift: { baseline: 125000, current: 148500, percentChange: 18.8, conversionRate: 14.5 },
        emergencyResponseTime: { detection: 45, alert: 15, staffArrival: 110, total: 170, baseline: 720 },
        energySavings: { current: 4850, baseline: 8080, percentSaved: 40.0, carbonReduced: 1650 },
        fanSatisfaction: 88,
        sensorUptime: 98.4,
        incidentResolutionRate: 94.2,
      },
      historicalKPIs: [],
    });

    useEnergyStore.setState({
      metrics: {
        venueId: 'venue-metlife',
        totalConsumption: 450,
        hvacConsumption: 292.5,
        lightingConsumption: 112.5,
        digitalConsumption: 45,
        renewablePercentage: 40,
        carbonFootprint: 182.25,
        baselineComparison: 15,
        zones: [],
        predictiveAlerts: [],
      },
    });

    useCrowdStore.setState({
      history: {
        'zone-north-upper': [
          { timestamp: Date.now(), occupancyPercent: 50, queueTime: 5 },
        ],
      },
      anomalies: [],
    });

    useSimulationStore.setState({
      isRunning: false,
      speed: 1,
      currentTime: Date.now(),
      eventPhase: 'pre-event',
      tickCount: 0,
    });
  });

  it('renders the sidebar navigation, head, and KPI cards correctly', () => {
    render(
      <MemoryRouter>
        <OperatorDashboard />
      </MemoryRouter>
    );

    // Sidebar Connected Venues
    expect(screen.getByText('MetLife Stadium')).toBeInTheDocument();
    expect(screen.getByText('SoFi Stadium')).toBeInTheDocument();

    // Main header title
    expect(screen.getByText('MetLife Stadium Command')).toBeInTheDocument();
    expect(screen.getByText('East Rutherford, USA · Regulatory Zone: NJ-EPA')).toBeInTheDocument();

    // KPI Cards check
    expect(screen.getByText('Live Attendance')).toBeInTheDocument();
    expect(screen.getByText('45,000')).toBeInTheDocument();
    expect(screen.getByText('Avg Wait Time')).toBeInTheDocument();
    expect(screen.getByText('12 min')).toBeInTheDocument();
    expect(screen.getByText('Concession Revenue')).toBeInTheDocument();
    expect(screen.getByText('$148,500.00')).toBeInTheDocument();
    expect(screen.getByText('Energy Optimization')).toBeInTheDocument();
    expect(screen.getByText('450 kWh')).toBeInTheDocument();
  });

  it('navigates back to landing page on back button click', () => {
    render(
      <MemoryRouter>
        <OperatorDashboard />
      </MemoryRouter>
    );

    const backBtn = screen.getByLabelText('Exit dashboard and return to selections portal');
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('allows switching between connected venues', () => {
    render(
      <MemoryRouter>
        <OperatorDashboard />
      </MemoryRouter>
    );

    const sofiTab = screen.getByText('SoFi Stadium');
    fireEvent.click(sofiTab);

    expect(useVenueStore.getState().selectedVenueId).toBe('venue-sofi');
    expect(screen.getByText('SoFi Stadium Command')).toBeInTheDocument();
  });

  it('shows detailed statistics when a stadium zone is selected', () => {
    render(
      <MemoryRouter>
        <OperatorDashboard />
      </MemoryRouter>
    );

    // Heatmap zone button
    const zoneBtn = screen.getByLabelText(/Zone North Upper: 50% occupancy/);
    fireEvent.click(zoneBtn);

    // Zone detail panel should render
    expect(screen.getByText('Zone details: North Upper Stand')).toBeInTheDocument();
    expect(screen.getByText('72°F')).toBeInTheDocument();
    expect(screen.getByText('45 AQI')).toBeInTheDocument();
    expect(screen.getByText('5 min')).toBeInTheDocument();
    expect(screen.getByText('120 kWh')).toBeInTheDocument();

    // Close zone details
    const closeBtn = screen.getByLabelText('Close detailed statistics panel for zone North Upper Stand');
    fireEvent.click(closeBtn);
    expect(screen.queryByText('Zone details: North Upper Stand')).not.toBeInTheDocument();
  });

  it('handles active incident select and workflow (acknowledging and resolving)', () => {
    render(
      <MemoryRouter>
        <OperatorDashboard />
      </MemoryRouter>
    );

    // Live Alert click
    const alertBtn = screen.getByRole('button', { name: /Incident Emergency Fall/ });
    fireEvent.click(alertBtn);

    // Active Response Playbook panel should open
    expect(screen.getByText('Active Response Playbook')).toBeInTheDocument();
    expect(screen.getAllByText('Emergency Fall').length).toBeGreaterThan(0);
    expect(screen.getAllByText('A fan slipped and fell near Row B.').length).toBeGreaterThan(0);

    // Acknowledge incident
    const ackBtn = screen.getByRole('button', { name: /Acknowledge incident and deploy operational playbooks/ });
    fireEvent.click(ackBtn);

    // State updates
    const updatedInc = useIncidentStore.getState().incidents[0];
    expect(updatedInc.status).toBe('responding');

    // Resolve incident
    const resolveBtn = screen.getByRole('button', { name: /Mark situation resolved/ });
    fireEvent.click(resolveBtn);

    const resolvedInc = useIncidentStore.getState().incidents[0];
    expect(resolvedInc.status).toBe('resolved');
  });

  it('renders general stadium occupancy rate when no zone or incident is selected', () => {
    render(
      <MemoryRouter>
        <OperatorDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText('Overall Stadium Occupancy Rate %')).toBeInTheDocument();
    expect(screen.getByText('Sustainability KPIs')).toBeInTheDocument();
  });
});
