import { memo } from 'react';
import { motion } from 'framer-motion';
import { EyeOff } from 'lucide-react';

interface FriendFinderProps {
  friends: Array<{ name: string; zone: string; distance: number }>;
  isEnabled: boolean;
}

export const FriendFinder = memo(function FriendFinder({ friends, isEnabled }: FriendFinderProps) {
  return (
    <motion.div
      key="friends"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
      role="tabpanel"
      aria-label="Friends Live Radar Panel"
    >
      <h2 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Live Friend Radar</h2>
      
      {isEnabled ? (
        <>
          <div
            role="img"
            aria-label="Radar interface map showing your location in the center, with Jake located 45 meters away in Concessions"
            style={{ height: '140px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}
          >
            {/* Radar grids */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120px', height: '120px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60px', height: '60px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '50%' }} />
            
            {/* You center */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '10px', height: '10px', background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 10px #3b82f6' }} />
            
            {/* Friends dots */}
            <div style={{ position: 'absolute', top: '25%', left: '35%', width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981' }} />
            <div style={{ position: 'absolute', top: '65%', left: '70%', width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} role="list" aria-label="Connected friends live distances">
            {friends.map((f, i) => (
              <div key={i} role="listitem" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{f.name}</div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Location: {f.zone}</span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>{f.distance}m away</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }} role="status">
          <EyeOff size={24} style={{ marginBottom: '8px' }} aria-hidden="true" />
          <div style={{ fontSize: '13px' }}>Friend finder disabled in privacy settings</div>
        </div>
      )}
    </motion.div>
  );
});
