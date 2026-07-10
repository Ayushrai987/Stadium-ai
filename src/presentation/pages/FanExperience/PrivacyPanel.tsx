import { memo } from 'react';
import { motion } from 'framer-motion';

interface PrivacyPanelProps {
  settings: {
    locationShare: boolean;
    personalizedOffers: boolean;
    friendFinder: boolean;
  };
  onToggle: (key: 'locationShare' | 'personalizedOffers' | 'friendFinder') => void;
  onExport: () => void;
}

export const PrivacyPanel = memo(function PrivacyPanel({ settings, onToggle, onExport }: PrivacyPanelProps) {
  return (
    <motion.div
      key="privacy"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
      role="tabpanel"
      aria-label="On-Device Privacy Panel"
    >
      <h2 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>On-Device Privacy Panel</h2>
      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
        We process location data locally. Personal info is isolated from crowds aggregates sent to operators.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* Location sharing Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>Live Location Sharing</div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>For wayfinding mapping</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.locationShare}
              onChange={() => onToggle('locationShare')}
              aria-label="Toggle Live Location Sharing"
            />
            <span className="toggle-slider" />
          </label>
        </div>

        {/* Offer learning Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>Personalized Offers</div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Local preference recognition</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.personalizedOffers}
              onChange={() => onToggle('personalizedOffers')}
              aria-label="Toggle Personalized Offers learning"
            />
            <span className="toggle-slider" />
          </label>
        </div>

        {/* Friend radar visibility Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>Friend Finder Visibility</div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Allow friends to locate you</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.friendFinder}
              onChange={() => onToggle('friendFinder')}
              aria-label="Toggle Friend Finder Visibility"
            />
            <span className="toggle-slider" />
          </label>
        </div>

        <button
          className="btn btn-secondary"
          style={{ fontSize: '12px', padding: '10px 0', width: '100%', marginTop: '8px' }}
          onClick={onExport}
          aria-label="Export personal profile data in JSON format"
        >
          Export Personal Data Profile (JSON)
        </button>
      </div>
    </motion.div>
  );
});
