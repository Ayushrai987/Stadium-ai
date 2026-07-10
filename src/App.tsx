import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  SkipNavLink,
  ErrorBoundary,
  ToastContainer,
  OfflineIndicator,
} from './presentation/components/common';

// Code splitting (lazy loading) for all page modules
const Landing = lazy(() => import('./presentation/pages/Landing/Landing'));
const OperatorDashboard = lazy(() => import('./presentation/pages/OperatorDashboard/OperatorDashboard'));
const FanExperience = lazy(() => import('./presentation/pages/FanExperience/FanExperience'));
const CommandCenter = lazy(() => import('./presentation/pages/CommandCenter/CommandCenter'));
const PrivacyCenter = lazy(() => import('./presentation/pages/PrivacyCenter/PrivacyCenter'));

/**
 * Loading fallback component with an accessible visual spinner.
 */
function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0e1a',
        color: '#94a3b8',
        gap: '16px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="loading-spinner" />
      <span style={{ fontSize: '14px', fontWeight: 500 }}>Loading system modules...</span>
    </div>
  );
}

/**
 * Main application layout routing.
 * Integrates global security indicators, notifications, skip navigation link,
 * and handles boundary failures gracefully.
 */
export function App() {
  return (
    <ErrorBoundary>
      <SkipNavLink targetId="main-content" />
      <OfflineIndicator />
      <ToastContainer />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/operator/*" element={<OperatorDashboard />} />
          <Route path="/fan" element={<FanExperience />} />
          <Route path="/command" element={<CommandCenter />} />
          <Route path="/privacy" element={<PrivacyCenter />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
