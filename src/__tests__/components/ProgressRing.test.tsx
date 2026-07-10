import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressRing } from '../../presentation/components/common/ProgressRing';

describe('ProgressRing Component', () => {
  it('should render circle path value text and proper progressbar accessibility attributes', () => {
    render(
      <ProgressRing
        value={65}
        size={100}
        strokeWidth={6}
        label="Grid renewable"
        sublabel="Renewable energy"
      />
    );

    // Verify progress text overlay is visible
    expect(screen.getByText('65%')).toBeInTheDocument();

    // Verify progressbar attributes
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('aria-valuenow', '65');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    expect(progressbar).toHaveAttribute('aria-label', 'Grid renewable: 65%');
  });

  it('should use default sublabels for aria attributes if label is missing', () => {
    render(
      <ProgressRing
        value={35}
        sublabel="Renewable Grid"
      />
    );

    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-label', 'Renewable Grid: 35%');
  });
});
