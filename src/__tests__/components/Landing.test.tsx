import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Landing } from '../../presentation/pages/Landing/Landing';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Landing Page Component', () => {
  it('renders landing page correctly', () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );

    expect(screen.getByText('STADIUM AI')).toBeInTheDocument();
    expect(screen.getByText('Stadium Operations')).toBeInTheDocument();
    expect(screen.getByText('Fan Experience')).toBeInTheDocument();
    expect(screen.getByText('Tournament Command')).toBeInTheDocument();
    expect(screen.getByText('Privacy & Compliance')).toBeInTheDocument();
  });

  it('navigates to corresponding routes when role cards are clicked', () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );

    const operationsCard = screen.getByRole('button', { name: /Stadium Operations Command Center Dashboard/i });
    fireEvent.click(operationsCard);
    expect(mockNavigate).toHaveBeenCalledWith('/operator');

    const fanCard = screen.getByRole('button', { name: /Fan Experience AR Navigation & Smart Commerce/i });
    fireEvent.click(fanCard);
    expect(mockNavigate).toHaveBeenCalledWith('/fan');

    const tournamentCard = screen.getByRole('button', { name: /Tournament Command Multi-Venue Orchestration/i });
    fireEvent.click(tournamentCard);
    expect(mockNavigate).toHaveBeenCalledWith('/command');

    const privacyCard = screen.getByRole('button', { name: /Privacy & Compliance Data Protection Center/i });
    fireEvent.click(privacyCard);
    expect(mockNavigate).toHaveBeenCalledWith('/privacy');
  });
});
