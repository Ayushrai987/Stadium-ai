import { Component, type ReactNode, type ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * React Error Boundary — catches render errors and displays
 * a graceful fallback UI instead of a white screen crash.
 * Logs structured error reports for debugging.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Structured error logging
    console.error('[ErrorBoundary] Uncaught error:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0e1a',
            color: '#f1f5f9',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              textAlign: 'center',
              padding: '40px',
              background: 'rgba(15, 22, 41, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '16px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 20px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
              }}
            >
              ⚠️
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px' }}>
              System Error Detected
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 24px', lineHeight: 1.5 }}>
              A component encountered an unexpected error. The rest of the platform remains operational.
              {import.meta.env.DEV && this.state.error && (
                <span style={{ display: 'block', marginTop: '12px', fontSize: '12px', color: '#ef4444', fontFamily: 'monospace' }}>
                  {this.state.error.message}
                </span>
              )}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Retry
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '10px 24px',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#94a3b8',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
