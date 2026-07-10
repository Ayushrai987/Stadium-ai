import { memo } from 'react';
import { motion } from 'framer-motion';

interface AccessibilityPanelProps {
  settings: {
    audioGuidance: boolean;
    accessibleRoutes: boolean;
    captions: boolean;
  };
  onToggle: (key: 'audioGuidance' | 'accessibleRoutes' | 'captions') => void;
}

export const AccessibilityPanel = memo(function AccessibilityPanel({ settings, onToggle }: AccessibilityPanelProps) {
  return (
    <motion.div
      key="access"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
      role="tabpanel"
      aria-label="Inclusive Access Settings Panel"
    >
      <h2 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Inclusive Access Settings</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* Audio Beacon Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>Audio Beacon Guidance</div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Acoustic navigation for visual impairments</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.audioGuidance}
              onChange={() => onToggle('audioGuidance')}
              aria-label="Toggle Audio Beacon Guidance"
            />
            <span className="toggle-slider" />
          </label>
        </div>

        {/* Accessible Routes Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>Accessible Routing Only</div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Avoid stairs and locate elevators/ramps</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.accessibleRoutes}
              onChange={() => onToggle('accessibleRoutes')}
              aria-label="Toggle Accessible Routing Only"
            />
            <span className="toggle-slider" />
          </label>
        </div>

        {/* Announcement Captions Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>Announcement Captions</div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Real-time text of loudspeaker updates</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.captions}
              onChange={() => onToggle('captions')}
              aria-label="Toggle Announcement Captions"
            />
            <span className="toggle-slider" />
          </label>
        </div>

      </div>
    </motion.div>
  );
});
