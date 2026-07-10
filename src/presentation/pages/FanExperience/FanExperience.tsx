import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVenueStore } from '../../../infrastructure/store/useVenueStore';
import { useKPIStore } from '../../../infrastructure/store/useKPIStore';
import { useShallow } from 'zustand/react/shallow';
import {
  Compass,
  Pizza,
  Users,
  Accessibility,
  Shield,
  ArrowLeft,
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { showToast } from '../../components/common';
import { DEFAULT_FAN_PROFILE, AR_DIRECTIONS } from '../../../constants';
import { validateStringInput } from '../../../infrastructure/security/InputSanitizer';
import { rateLimiter } from '../../../infrastructure/security/RateLimiter';
import { ArWayfinding, ConcessionOffers, FriendFinder, AccessibilityPanel, PrivacyPanel } from './';

interface OrderItem {
  id: string;
  item: string;
  price: number;
  status: string;
}

/**
 * Fan Experience Mobile App Mockup page.
 * Renders inside a phone frame simulation. Includes AR wayfinding overlays,
 * custom accessible toggle controls, local friends proximity indicators,
 * personalized concession pre-order checkouts, and on-device privacy toggles.
 */
export function FanExperience() {
  const navigate = useNavigate();
  const { getSelectedVenue } = useVenueStore(useShallow(state => ({ getSelectedVenue: state.getSelectedVenue })));
  const currentVenue = getSelectedVenue();

  const [activeTab, setActiveTab] = useState<'nav' | 'offers' | 'friends' | 'access' | 'privacy'>('nav');
  const [profile, setProfile] = useState({
    ...DEFAULT_FAN_PROFILE,
    orders: [] as OrderItem[],
  });
  const [arStep, setArStep] = useState(0);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  // Auto progression of AR wayfinding steps
  useEffect(() => {
    if (activeTab !== 'nav') return;
    const interval = setInterval(() => {
      setArStep(prev => (prev + 1) % AR_DIRECTIONS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleOrder = (item: string, price: number) => {
    if (!rateLimiter.isAllowed('fan-order', 5, 60000)) {
      showToast('Rate limit exceeded. Please wait before ordering again.', 'error');
      return;
    }

    const sanitizedItem = validateStringInput(item, 100);
    if (!sanitizedItem) {
      showToast('Invalid item name detected.', 'error');
      return;
    }

    const orderId = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newOrder: OrderItem = { id: orderId, item: sanitizedItem, price, status: 'Pre-ordered (2 min wait)' };
    
    setProfile(prev => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
    }));

    // Record business KPI revenue lift
    useKPIStore.getState().updateKPIs(prev => ({
      ...prev,
      revenueLift: {
        ...prev.revenueLift,
        current: prev.revenueLift.current + price,
      },
    }));

    showToast(`Order Confirmed: ${item}! Pre-ordered ticket created.`, 'success');
    setAnnouncement(`Order placed for ${item}. Order ID is ${orderId}`);
  };

  const toggleAccess = (key: keyof typeof DEFAULT_FAN_PROFILE.accessibility) => {
    setProfile(prev => {
      const nextVal = !prev.accessibility[key];
      showToast(`${key.replace(/([A-Z])/g, ' $1')} ${nextVal ? 'enabled' : 'disabled'}`, 'info');
      return {
        ...prev,
        accessibility: {
          ...prev.accessibility,
          [key]: nextVal,
        },
      };
    });
  };

  const togglePrivacy = (key: keyof typeof DEFAULT_FAN_PROFILE.privacy) => {
    setProfile(prev => {
      const nextVal = !prev.privacy[key];
      showToast(`${key.replace(/([A-Z])/g, ' $1')} ${nextVal ? 'enabled' : 'disabled'}`, 'info');
      return {
        ...prev,
        privacy: {
          ...prev.privacy,
          [key]: nextVal,
        },
      };
    });
  };

  const handleDataExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({
        name: profile.name,
        seat: profile.seat,
        location: profile.location,
        privacy: profile.privacy,
        accessibility: profile.accessibility,
        orders: profile.orders,
      }, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', 'stadium_ai_fan_profile.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Exporting all logged fan profile data locally in JSON format...', 'success');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', padding: '20px 0' }}>
      <div className="fan-app-viewport">
        <div className="fan-app-container">
          {/* Header */}
          <header className="fan-app-header">
            <button
              onClick={() => navigate('/')}
              aria-label="Back to landing portal"
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <ArrowLeft size={20} aria-hidden="true" />
            </button>
            <div style={{ textAlign: 'center' }} role="presentation">
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {currentVenue?.name || 'MetLife Stadium'}
              </span>
              <h1 style={{ fontSize: '13px', fontWeight: 700, margin: 0 }}>FAN GUIDE</h1>
            </div>
            <div style={{ width: '20px' }} aria-hidden="true" />
          </header>

          {/* Accessible announcement banner */}
          <div className="sr-only" role="status" aria-live="polite">
            {announcement}
          </div>

          {/* Scrollable Viewport area */}
          <main id="main-content" className="fan-app-content">
            <AnimatePresence mode="wait">
              {/* Tab 1: AR Navigation */}
              {activeTab === 'nav' && (
                <ArWayfinding arStep={arStep} profile={profile} />
              )}

              {/* Tab 2: Smart Offers & Concession Orders */}
              {activeTab === 'offers' && (
                <ConcessionOffers orders={profile.orders} onOrder={handleOrder} />
              )}

              {/* Tab 3: Friend Finder */}
              {activeTab === 'friends' && (
                <FriendFinder friends={[...profile.friends]} isEnabled={profile.privacy.friendFinder} />
              )}

              {/* Tab 4: Accessibility Toggles */}
              {activeTab === 'access' && (
                <AccessibilityPanel settings={profile.accessibility} onToggle={toggleAccess} />
              )}

              {/* Tab 5: Privacy Controls */}
              {activeTab === 'privacy' && (
                <PrivacyPanel settings={profile.privacy} onToggle={togglePrivacy} onExport={handleDataExport} />
              )}
            </AnimatePresence>
          </main>

          {/* Bottom Tab Bar */}
          <nav className="fan-app-nav" role="tablist" aria-label="Mobile Application Navigation tabs">
            <button
              role="tab"
              aria-selected={activeTab === 'nav'}
              aria-controls="nav-tab"
              onClick={() => setActiveTab('nav')}
              className={`fan-nav-item ${activeTab === 'nav' ? 'active' : ''}`}
            >
              <Compass size={20} aria-hidden="true" />
              <span>Map</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'offers'}
              aria-controls="offers-tab"
              onClick={() => setActiveTab('offers')}
              className={`fan-nav-item ${activeTab === 'offers' ? 'active' : ''}`}
            >
              <Pizza size={20} aria-hidden="true" />
              <span>Offers</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'friends'}
              aria-controls="friends-tab"
              onClick={() => setActiveTab('friends')}
              className={`fan-nav-item ${activeTab === 'friends' ? 'active' : ''}`}
            >
              <Users size={20} aria-hidden="true" />
              <span>Friends</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'access'}
              aria-controls="access-tab"
              onClick={() => setActiveTab('access')}
              className={`fan-nav-item ${activeTab === 'access' ? 'active' : ''}`}
            >
              <Accessibility size={20} aria-hidden="true" />
              <span>Access</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'privacy'}
              aria-controls="privacy-tab"
              onClick={() => setActiveTab('privacy')}
              className={`fan-nav-item ${activeTab === 'privacy' ? 'active' : ''}`}
            >
              <Shield size={20} aria-hidden="true" />
              <span>Privacy</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default FanExperience;
