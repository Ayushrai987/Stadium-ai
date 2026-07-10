import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SkipNavLink } from '../../presentation/components/common/SkipNavLink';

describe('SkipNavLink Component', () => {
  it('renders correctly', () => {
    render(<SkipNavLink targetId="main-content" />);
    const link = screen.getByText('Skip to main content');
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('#main-content');
  });

  it('adjusts position on focus and blur', () => {
    render(<SkipNavLink targetId="main-content" />);
    const link = screen.getByText('Skip to main content');

    fireEvent.focus(link);
    expect(link.style.top).toBe('0px');

    fireEvent.blur(link);
    expect(link.style.top).toBe('-100%');
  });
});
