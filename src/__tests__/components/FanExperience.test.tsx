import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FanExperience } from '../../presentation/pages/FanExperience/FanExperience';
import { useKPIStore } from '../../infrastructure/store/useKPIStore';
import { useVenueStore } from '../../infrastructure/store/useVenueStore';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('FanExperience Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();

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
          regulatoryRegion: 'OTHER',
          zones: [],
          status: 'operational',
          coordinates: { lat: 40.8135, lng: -74.0744 },
        },
      ],
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
  });

  it('renders the main app viewport, default Map tab, and assigned seat info', () => {
    render(
      <MemoryRouter>
        <FanExperience />
      </MemoryRouter>
    );

    expect(screen.getByText('MetLife Stadium')).toBeInTheDocument();
    expect(screen.getByText('FAN GUIDE')).toBeInTheDocument();
    expect(screen.getByText('Wayfinding Guidance')).toBeInTheDocument();
    expect(screen.getByText('YOUR ASSIGNED SEAT')).toBeInTheDocument();
  });

  it('allows navigation back to the selections portal', () => {
    render(
      <MemoryRouter>
        <FanExperience />
      </MemoryRouter>
    );

    const backBtn = screen.getByLabelText('Back to landing portal');
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('switches tabs to Offers and allows ordering a dynamic concession offer', () => {
    render(
      <MemoryRouter>
        <FanExperience />
      </MemoryRouter>
    );

    // Switch to Offers tab
    const offersTab = screen.getByRole('tab', { name: 'Offers' });
    fireEvent.click(offersTab);

    expect(screen.getByText('Personalized Concession Offers')).toBeInTheDocument();
    expect(screen.getByText('Halftime Special Combo')).toBeInTheDocument();

    // Order an offer
    const initialKPIs = useKPIStore.getState().kpis.revenueLift.current;
    const preOrderBtn = screen.getByRole('button', { name: 'Pre-Order Halftime Special Combo for $12.00' });
    fireEvent.click(preOrderBtn);

    // Verify order is created in active list
    expect(screen.getByText('Active Digital Orders')).toBeInTheDocument();
    expect(screen.getAllByText('Halftime Special Combo').length).toBeGreaterThan(0);

    // Verify revenue KPI was updated
    expect(useKPIStore.getState().kpis.revenueLift.current).toBe(initialKPIs + 12);
  });

  it('switches tabs to Friends and displays the friend locator radar if enabled', () => {
    render(
      <MemoryRouter>
        <FanExperience />
      </MemoryRouter>
    );

    // Switch to Friends tab
    const friendsTab = screen.getByRole('tab', { name: 'Friends' });
    fireEvent.click(friendsTab);

    expect(screen.getByText('Live Friend Radar')).toBeInTheDocument();
    expect(screen.getByText('Jake')).toBeInTheDocument();
    expect(screen.getByText('Location: Aisle N Concessions')).toBeInTheDocument();
  });

  it('switches tabs to Access and permits toggling audio guidance', () => {
    render(
      <MemoryRouter>
        <FanExperience />
      </MemoryRouter>
    );

    // Switch to Access tab
    const accessTab = screen.getByRole('tab', { name: 'Access' });
    fireEvent.click(accessTab);

    expect(screen.getByText('Inclusive Access Settings')).toBeInTheDocument();
    const toggle = screen.getByLabelText('Toggle Audio Beacon Guidance');
    expect(toggle).not.toBeChecked();

    fireEvent.click(toggle);
    expect(toggle).toBeChecked();
  });

  it('switches tabs to Privacy, handles privacy toggles, and disables friend finder accordingly', () => {
    render(
      <MemoryRouter>
        <FanExperience />
      </MemoryRouter>
    );

    // Switch to Privacy tab
    const privacyTab = screen.getByRole('tab', { name: 'Privacy' });
    fireEvent.click(privacyTab);

    expect(screen.getByText('On-Device Privacy Panel')).toBeInTheDocument();
    const toggle = screen.getByLabelText('Toggle Friend Finder Visibility');
    expect(toggle).toBeChecked();

    // Disable friend finder in privacy settings
    fireEvent.click(toggle);
    expect(toggle).not.toBeChecked();

    // Switch back to Friends tab and verify radar is disabled
    const friendsTab = screen.getByRole('tab', { name: 'Friends' });
    fireEvent.click(friendsTab);

    expect(screen.getByText('Friend finder disabled in privacy settings')).toBeInTheDocument();
  });

  it('handles JSON profile data export locally', () => {
    render(
      <MemoryRouter>
        <FanExperience />
      </MemoryRouter>
    );

    const privacyTab = screen.getByRole('tab', { name: 'Privacy' });
    fireEvent.click(privacyTab);

    // Spy on document.createElement and anchor element interactions
    const mockAnchor = {
      setAttribute: vi.fn(),
      click: vi.fn(),
      remove: vi.fn(),
    };
    // Cast to HTMLAnchorElement mock structure to avoid "any"
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as unknown as HTMLAnchorElement);
    const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockAnchor as unknown as Node);

    const exportBtn = screen.getByRole('button', { name: 'Export personal profile data in JSON format' });
    fireEvent.click(exportBtn);

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(mockAnchor.setAttribute).toHaveBeenCalledWith('download', 'stadium_ai_fan_profile.json');
    expect(mockAnchor.click).toHaveBeenCalled();
    expect(mockAnchor.remove).toHaveBeenCalled();

    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
  });
});
