import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CommandCenter } from '../../presentation/pages/CommandCenter/CommandCenter';
import { useVenueStore } from '../../infrastructure/store/useVenueStore';
import { useIncidentStore } from '../../infrastructure/store/useIncidentStore';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CommandCenter Page Component', () => {
  it('renders tournament operation dashboard components correctly', () => {
    useVenueStore.setState({
      venues: [
        {
          id: 'venue-1',
          name: 'MetLife Stadium',
          city: 'East Rutherford',
          country: 'USA',
          capacity: 80000,
          currentAttendance: 50000,
          zones: [],
          status: 'operational',
          coordinates: { lat: 40.8135, lng: -74.0744 },
          sensorHealth: 98,
          regulatoryRegion: 'GDPR',
        },
      ],
    });

    useIncidentStore.setState({
      incidents: [
        {
          id: 'inc-1',
          venueId: 'venue-1',
          zoneId: 'zone-1',
          type: 'medical',
          severity: 'critical',
          status: 'detected',
          title: 'Heat Stroke',
          description: 'A fan collapsed due to high heat.',
          assignedTo: null,
          location: 'Section 104',
          detectedAt: Date.now() - 30000,
          alertedAt: Date.now() - 30000,
          respondedAt: null,
          resolvedAt: null,
          automatedActions: [],
          decisionAuditTrail: [],
        },
      ],
    });

    render(
      <MemoryRouter>
        <CommandCenter />
      </MemoryRouter>
    );

    expect(screen.getByText('Tournament Operations command')).toBeInTheDocument();
    expect(screen.getByText('MetLife Stadium')).toBeInTheDocument();
    expect(screen.getByText('Heat Stroke')).toBeInTheDocument();
    expect(screen.getByText('Medical Alpha Responders')).toBeInTheDocument();
  });

  it('navigates back to landing page on back click', () => {
    render(
      <MemoryRouter>
        <CommandCenter />
      </MemoryRouter>
    );

    const backBtn = screen.getByLabelText('Back to main selections portal');
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('allows selecting a response playbook', () => {
    render(
      <MemoryRouter>
        <CommandCenter />
      </MemoryRouter>
    );

    const playbookBtn = screen.getByRole('button', { name: /Playbook Capacity Overload Playbook/i });
    fireEvent.click(playbookBtn);
    expect(playbookBtn.getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(playbookBtn);
    expect(playbookBtn.getAttribute('aria-pressed')).toBe('false');
  });

  it('can submit a broadcast message and sanitizes input', () => {
    render(
      <MemoryRouter>
        <CommandCenter />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Broadcast global message...');
    const sendBtn = screen.getByRole('button', { name: /Send global broadcast message/i });

    // Try sending empty message (invalid)
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(sendBtn);

    // Try sending valid message
    fireEvent.change(input, { target: { value: 'Severe weather incoming' } });
    fireEvent.click(sendBtn);
    expect(input).toHaveValue('');
  });
});
