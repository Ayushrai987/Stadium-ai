import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GlassCard } from '../../presentation/components/common/GlassCard';
import { Shield } from 'lucide-react';

describe('GlassCard Component', () => {
  it('renders children correctly', () => {
    render(<GlassCard>Card Content</GlassCard>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('renders title, icon, and badge when provided', () => {
    render(
      <GlassCard
        title="Test Card"
        icon={Shield}
        badge={{ text: 'Active', color: '#10b981' }}
      >
        Card Content
      </GlassCard>
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('handles click events when onClick is provided', () => {
    const handleClick = vi.fn();
    render(<GlassCard onClick={handleClick}>Clickable</GlassCard>);

    const card = screen.getByText('Clickable');
    fireEvent.click(card);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
