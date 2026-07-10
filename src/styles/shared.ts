import type { CSSProperties } from 'react';

export const sharedStyles = {
  // Base glass panel container
  glassPanel: {
    background: 'rgba(15, 22, 41, 0.8)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '24px',
  } as CSSProperties,

  // KPI card container style
  kpiCard: {
    background: 'rgba(15, 22, 41, 0.8)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  } as CSSProperties,

  // Alert/Danger playbook container style
  dangerPanel: {
    background: 'rgba(239, 68, 68, 0.05)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '16px',
    padding: '24px',
    height: '100%',
  } as CSSProperties,

  // Parameter/Sub-items in grid/lists with subtle bg
  lightPanelItem: {
    background: 'rgba(255, 255, 255, 0.02)',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
  } as CSSProperties,

  // Flex center container helper
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as CSSProperties,

  // Toggle switch row container style
  appToggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'var(--bg-card)',
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid var(--border)',
  } as CSSProperties,

  // App specific container panel
  appPanelItem: {
    background: 'rgba(255, 255, 255, 0.02)',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
  } as CSSProperties,

  // Seat detail card
  seatDetailCard: {
    background: 'var(--bg-card)',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
  } as CSSProperties,

  // Radar simulator container style
  radarContainer: {
    height: '140px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    position: 'relative',
    overflow: 'hidden',
  } as CSSProperties,

  // Audio beacon overlay badge style
  audioBeaconBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    background: 'rgba(139, 92, 246, 0.9)',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '9px',
    fontWeight: 600,
  } as CSSProperties,
};
