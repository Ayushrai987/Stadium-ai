import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../../presentation/components/common/ErrorBoundary';

// A mock component that throws an error on render
const ProblemChild = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Problem rendering child component');
  }
  return <div>Happy Child</div>;
};

describe('ErrorBoundary Component', () => {
  it('should render children when no exceptions are raised', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Happy Child')).toBeInTheDocument();
  });

  it('should render fallback error screen when a child throws', () => {
    // Prevent vitest from logging the expected mock error stack trace to console
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('System Error Detected')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
