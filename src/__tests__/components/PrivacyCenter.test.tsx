import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PrivacyCenter } from '../../presentation/pages/PrivacyCenter/PrivacyCenter';
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

describe('PrivacyCenter Page Component', () => {
  it('renders privacy dashboard properly', () => {
    // Setup state
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

    render(
      <MemoryRouter>
        <PrivacyCenter />
      </MemoryRouter>
    );

    expect(screen.getByText('Privacy & Data Compliance Center')).toBeInTheDocument();
    expect(screen.getByText('GDPR Right to Be Forgotten Queue')).toBeInTheDocument();
    expect(screen.getByText('del-883')).toBeInTheDocument();
    expect(screen.getByText('del-884')).toBeInTheDocument();
  });

  it('handles navigation back to landing page', () => {
    render(
      <MemoryRouter>
        <PrivacyCenter />
      </MemoryRouter>
    );

    const backBtn = screen.getByLabelText('Back to landing portal');
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('triggers deletion confirmation flow and deletes item', () => {
    render(
      <MemoryRouter>
        <PrivacyCenter />
      </MemoryRouter>
    );

    // Click delete on del-883
    const deleteBtns = screen.getAllByRole('button', { name: /Verify and execute deletion/i });
    fireEvent.click(deleteBtns[0]);

    // Check if dialog is visible
    expect(screen.getByText('Confirm User Profile Purge')).toBeInTheDocument();

    // Confirm deletion
    const confirmBtn = screen.getByRole('button', { name: /Proceed/i });
    fireEvent.click(confirmBtn);

    // Verify item deleted from queue
    expect(screen.queryByText('del-883')).not.toBeInTheDocument();
    expect(screen.getByText('del-884')).toBeInTheDocument();
  });

  it('cancels deletion confirmation flow when cancel is clicked', () => {
    render(
      <MemoryRouter>
        <PrivacyCenter />
      </MemoryRouter>
    );

    // Click delete on del-883
    const deleteBtns = screen.getAllByRole('button', { name: /Verify and execute deletion/i });
    fireEvent.click(deleteBtns[0]);

    // Check if dialog is visible
    expect(screen.getByText('Confirm User Profile Purge')).toBeInTheDocument();

    // Cancel deletion
    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    // Verify item is still in queue
    expect(screen.getByText('del-883')).toBeInTheDocument();
  });
});
