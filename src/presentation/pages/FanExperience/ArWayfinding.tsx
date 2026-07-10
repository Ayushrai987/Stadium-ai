import { memo } from 'react';
import { motion } from 'framer-motion';
import { Compass, MapPin } from 'lucide-react';
import { AR_DIRECTIONS } from '../../../constants';

interface ArWayfindingProps {
  arStep: number;
  profile: any;
}

export const ArWayfinding = memo(function ArWayfinding({ arStep, profile }: ArWayfindingProps) {
  return (
    <motion.div
      key="nav"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      role="tabpanel"
      aria-label="AR Navigation Map Panel"
    >
      <div className="ar-container" role="img" aria-label="Visual AR Navigation Guide showing blue pathway overlay towards Section 104">
        <div className="ar-beacon-grid" />
        <div className="ar-path-line" style={{ transform: `skewX(-15deg) translateY(${arStep * 15}px)` }} />
        <Compass size={40} className="anim-float" color="var(--primary)" style={{ position: 'absolute' }} aria-hidden="true" />
        
        {/* Access beacon hint overlay */}
        {profile.accessibility.audioGuidance && (
          <div
            role="status"
            aria-live="polite"
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'rgba(139, 92, 246, 0.9)',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '9px',
              fontWeight: 600,
            }}
          >
            🔊 AUDIO BEACON NAVIGATION ACTIVE
          </div>
        )}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
          <MapPin size={16} aria-hidden="true" /> Wayfinding Guidance
        </div>
        <div style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9' }} role="alert" aria-live="assertive">
          {AR_DIRECTIONS[arStep]?.instruction || ''}
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
          {AR_DIRECTIONS[arStep]?.detail || ''}
        </p>
      </div>

      {/* Seat detail info box */}
      <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>YOUR ASSIGNED SEAT</span>
        <strong style={{ fontSize: '15px', fontWeight: 600, marginTop: '2px', display: 'block' }}>{profile.seat}</strong>
      </div>
    </motion.div>
  );
});
