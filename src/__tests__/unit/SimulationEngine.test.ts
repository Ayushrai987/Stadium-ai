import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { simulationEngine } from '../../infrastructure/simulation/SimulationEngine';
import { useSimulationStore } from '../../infrastructure/store/useSimulationStore';
import { useVenueStore } from '../../infrastructure/store/useVenueStore';
import { useCrowdStore } from '../../infrastructure/store/useCrowdStore';
import { useEnergyStore } from '../../infrastructure/store/useEnergyStore';
import { useIncidentStore } from '../../infrastructure/store/useIncidentStore';
import { useKPIStore } from '../../infrastructure/store/useKPIStore';
import * as SensorSimulator from '../../infrastructure/simulation/SensorSimulator';

vi.mock('../../infrastructure/simulation/SensorSimulator', () => ({
  generateSensorReadings: vi.fn((zones) => zones), // Default mock returns zones unchanged
}));

describe('SimulationEngine Class', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Reset stores to default state
    useSimulationStore.getState().reset();
    useCrowdStore.setState({ history: {}, anomalies: [] });
    useIncidentStore.setState({ incidents: [], activeIncidentId: null });
    useEnergyStore.setState({ metrics: null });
    useKPIStore.setState({
      kpis: {
        queueTimeReduction: { before: 18, after: 12, percentChange: -33.3 },
        revenueLift: { baseline: 125000, current: 148500, percentChange: 18.8, conversionRate: 14.5 },
        emergencyResponseTime: { detection: 45, alert: 15, staffArrival: 110, total: 170, baseline: 720 },
        energySavings: { current: 4850, baseline: 8080, percentSaved: 40.0, carbonReduced: 1650 },
        fanSatisfaction: 88,
        sensorUptime: 98.4,
        incidentResolutionRate: 94.2,
      },
      historicalKPIs: [],
    });
  });

  afterEach(() => {
    simulationEngine.stop();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should start the simulation scheduler', () => {
    expect(useSimulationStore.getState().isRunning).toBe(false);
    simulationEngine.start();
    expect(useSimulationStore.getState().isRunning).toBe(true);
  });

  it('should not schedule duplicate ticks if already running', () => {
    const startSpy = vi.spyOn(useSimulationStore.getState(), 'start');
    simulationEngine.start();
    simulationEngine.start(); // second call
    expect(startSpy).toHaveBeenCalledTimes(1);
  });

  it('should stop the simulation scheduler', () => {
    simulationEngine.start();
    expect(useSimulationStore.getState().isRunning).toBe(true);
    simulationEngine.stop();
    expect(useSimulationStore.getState().isRunning).toBe(false);
  });

  it('should adjust speed and restart scheduler if running', () => {
    const stopSpy = vi.spyOn(simulationEngine, 'stop');
    const startSpy = vi.spyOn(simulationEngine, 'start');
    
    simulationEngine.start();
    expect(useSimulationStore.getState().speed).toBe(1);
    
    simulationEngine.setSpeed(2);
    expect(useSimulationStore.getState().speed).toBe(2);
    expect(stopSpy).toHaveBeenCalled();
    expect(startSpy).toHaveBeenCalled();
  });

  it('should execute tick steps and update stores periodically', () => {
    simulationEngine.start();
    
    // Advance timers by 1 tick (1000ms base tick interval)
    vi.advanceTimersByTime(1000);
    
    const simState = useSimulationStore.getState();
    expect(simState.tickCount).toBe(1);

    // KPI history is recorded on intervals (KPI_HISTORY_INTERVAL is 5)
    // Let's run for 5 ticks to trigger KPI recording and crowd anomalies
    for (let i = 0; i < 4; i++) {
      vi.advanceTimersByTime(1000);
    }
    
    expect(useSimulationStore.getState().tickCount).toBe(5);
    expect(useKPIStore.getState().historicalKPIs).toHaveLength(1);
  });

  it('should automatically advance phases', () => {
    simulationEngine.start();
    // Advance 120 ticks to trigger next phase
    for (let i = 0; i < 120; i++) {
      vi.advanceTimersByTime(1000);
    }
    expect(useSimulationStore.getState().eventPhase).not.toBe('pre-event');
  });

  it('should record crowd history points and check anomalies', () => {
    // Force a venue zone to have high occupancy to trigger anomaly warning
    const venueStore = useVenueStore.getState();
    const mockVenues = venueStore.venues.map(v => ({
      ...v,
      zones: v.zones.map(z => ({
        ...z,
        capacity: 100,
        currentOccupancy: 95, // 95% occupancy (>92% threshold)
      })),
    }));
    venueStore.setVenues(mockVenues);

    simulationEngine.start();

    // Advance 5 ticks (ANOMALY_CHECK_INTERVAL is 5)
    for (let i = 0; i < 5; i++) {
      vi.advanceTimersByTime(1000);
    }

    const anomalies = useCrowdStore.getState().anomalies;
    expect(anomalies.length).toBeGreaterThan(0);
    expect(anomalies[0].message).toContain('Crowd surge');
  });

  it('should update energy metrics and check temperature alerts', () => {
    // Force a venue zone to have high temperature to trigger HVAC warning
    const venueStore = useVenueStore.getState();
    const mockVenues = venueStore.venues.map(v => ({
      ...v,
      zones: v.zones.map(z => ({
        ...z,
        temperature: 85, // >79 threshold
      })),
    }));
    venueStore.setVenues(mockVenues);

    simulationEngine.start();

    // Advance 10 ticks (ENERGY_ALERT_INTERVAL is 10)
    for (let i = 0; i < 10; i++) {
      vi.advanceTimersByTime(1000);
    }

    const energyState = useEnergyStore.getState();
    expect(energyState.metrics).not.toBeNull();
    expect(energyState.metrics?.predictiveAlerts.length).toBeGreaterThan(0);
  });

  it('should inject incidents during active play', () => {
    useSimulationStore.setState({ eventPhase: 'first-half' });
    // Stub Math.random to always return a low value (below INCIDENT_INJECTION_RATE 0.003)
    vi.spyOn(Math, 'random').mockReturnValue(0.001);

    simulationEngine.start();
    vi.advanceTimersByTime(1000);

    const incidentState = useIncidentStore.getState();
    expect(incidentState.incidents.length).toBeGreaterThan(0);
  });
});
