import { useCallback } from 'react';
import { useSimulationStore } from '../../../infrastructure/store/useSimulationStore';
import { useShallow } from 'zustand/react/shallow';
import { Play, Pause, FastForward, RotateCcw } from 'lucide-react';
import { simulationEngine } from '../../../infrastructure/simulation/SimulationEngine';

/**
 * Floating simulation telemetry control toolbar.
 * Supports simulation play/pause, speed acceleration (1x, 2x, 5x), phase transitions,
 * and state resets. Fully accessible with role="toolbar".
 */
export function SimulationControl() {
  const { isRunning, speed, eventPhase, tickCount } = useSimulationStore(useShallow(state => ({
    isRunning: state.isRunning,
    speed: state.speed,
    eventPhase: state.eventPhase,
    tickCount: state.tickCount,
  })));

  const handleToggle = useCallback(() => {
    if (useSimulationStore.getState().isRunning) {
      simulationEngine.stop();
    } else {
      simulationEngine.start();
    }
  }, []);

  const handleSpeed = useCallback((s: number) => {
    simulationEngine.setSpeed(s);
  }, []);

  const handleReset = useCallback(() => {
    simulationEngine.stop();
    useSimulationStore.getState().reset();
  }, []);

  const handleNextPhase = useCallback(() => {
    useSimulationStore.getState().nextPhase();
  }, []);

  return (
    <div
      role="toolbar"
      aria-label="Simulation Control Telemetry Toolbar"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        background: 'rgba(15, 22, 41, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }} role="presentation">
        <span style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Sim Control ({tickCount} ticks)
        </span>
        <span
          role="status"
          aria-live="polite"
          style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 600, textTransform: 'capitalize' }}
        >
          Phase: {eventPhase.replace('-', ' ')}
        </span>
      </div>

      <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.08)' }} aria-hidden="true" />

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={handleToggle}
          aria-label={isRunning ? 'Pause telemetry simulation' : 'Start telemetry simulation'}
          style={{
            background: isRunning ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${isRunning ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: isRunning ? '#ef4444' : '#10b981',
          }}
          title={isRunning ? 'Pause' : 'Play'}
        >
          {isRunning ? <Pause size={14} fill="#ef4444" aria-hidden="true" /> : <Play size={14} fill="#10b981" aria-hidden="true" />}
        </button>

        {[1, 2, 5].map((s) => (
          <button
            key={s}
            onClick={() => handleSpeed(s)}
            aria-label={`Set simulation speed to ${s} times`}
            aria-pressed={speed === s}
            style={{
              background: speed === s ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${speed === s ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: '8px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              color: speed === s ? '#3b82f6' : '#94a3b8',
            }}
          >
            {s}x
          </button>
        ))}

        <button
          onClick={handleNextPhase}
          aria-label="Advance to next stadium event phase"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#94a3b8',
          }}
          title="Next Event Phase"
        >
          <FastForward size={14} aria-hidden="true" />
        </button>

        <button
          onClick={handleReset}
          aria-label="Reset simulation telemetry clock and stats"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#94a3b8',
          }}
          title="Reset Simulation"
        >
          <RotateCcw size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default SimulationControl;
