import { useSimulationStore } from '../store/useSimulationStore';
import { useVenueStore } from '../store/useVenueStore';
import { useKPIStore } from '../store/useKPIStore';
import { useCrowdStore } from '../store/useCrowdStore';
import { useEnergyStore } from '../store/useEnergyStore';
import { useIncidentStore } from '../store/useIncidentStore';
import { generateSensorReadings } from './SensorSimulator';
import { SIMULATION, ENERGY } from '../../constants';

/**
 * Coordinates all real-time simulated telemetry ticks, state updates,
 * crowd anomalies, energy metrics calculations, and automated incident injection.
 */
class SimulationEngine {
  private timer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Starts the simulation tick scheduler if it is not already running.
   */
  start(): void {
    const isRunning = useSimulationStore.getState().isRunning;
    if (isRunning) return;

    useSimulationStore.getState().start();
    this.scheduleTick();
  }

  /**
   * Stops the simulation tick scheduler and clears any scheduled timers.
   */
  stop(): void {
    useSimulationStore.getState().stop();
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  /**
   * Adjusts the speed multiplier of the simulation and reschedules the next tick.
   * @param speed - The speed multiplier (1, 2, or 5)
   */
  setSpeed(speed: number): void {
    useSimulationStore.getState().setSpeed(speed);
    if (useSimulationStore.getState().isRunning) {
      this.stop();
      this.start();
    }
  }

  /**
   * Schedules the next tick based on current simulation speed settings.
   */
  private scheduleTick(): void {
    const speed = useSimulationStore.getState().speed;
    const interval = Math.max(SIMULATION.MIN_TICK_INTERVAL_MS, SIMULATION.BASE_TICK_INTERVAL_MS / speed);
    this.timer = setTimeout(() => this.tick(), interval);
  }

  /**
   * Primary simulation logic executed on each tick.
   */
  private tick(): void {
    const isRunning = useSimulationStore.getState().isRunning;
    if (!isRunning) return;

    // 1. Tick the simulation store
    useSimulationStore.getState().tick();
    const state = useSimulationStore.getState();
    const tickCount = state.tickCount;
    const eventPhase = state.eventPhase;

    // 2. Automatically advance phases
    if (tickCount > 0 && tickCount % SIMULATION.PHASE_TRANSITION_TICKS === 0) {
      useSimulationStore.getState().nextPhase();
    }

    // 3. Update all venue sensor readings
    const venueStore = useVenueStore.getState();
    const venues = venueStore.venues;
    
    venues.forEach((venue) => {
      // Simulate sensor updates on this venue's zones
      const updatedZones = generateSensorReadings(venue.zones, eventPhase, tickCount);
      venueStore.updateVenueZones(venue.id, updatedZones);

      // Record crowd history for chart visualization
      updatedZones.forEach((zone) => {
        const occupancyPercent = zone.capacity > 0 ? (zone.currentOccupancy / zone.capacity) * 100 : 0;
        useCrowdStore.getState().addHistoryPoint(zone.id, occupancyPercent, zone.queueTime);

        // Anomaly warnings: crowd density threshold checked at intervals
        if (tickCount % SIMULATION.ANOMALY_CHECK_INTERVAL === 0 && occupancyPercent > SIMULATION.ANOMALY_THRESHOLD_PERCENT) {
          useCrowdStore.getState().addAnomaly(
            zone.id,
            `Crowd surge: ${zone.name} is approaching capacity (${Math.round(occupancyPercent)}%)`
          );
        }
      });
    });

    // 4. Energy metrics simulator update
    const selectedVenue = venueStore.getSelectedVenue();
    if (selectedVenue) {
      const zones = selectedVenue.zones;
      const totalKWh = zones.reduce((acc, z) => acc + z.energyUsage, 0);
      const hvacKWh = totalKWh * ENERGY.HVAC_RATIO;
      const lightKWh = totalKWh * ENERGY.LIGHTING_RATIO;
      const digitalKWh = totalKWh * ENERGY.DIGITAL_RATIO;

      const renewablePercentage = ENERGY.BASE_RENEWABLE_PERCENT + Math.sin(tickCount * 0.05) * ENERGY.RENEWABLE_AMPLITUDE + (eventPhase === 'halftime' ? -5 : 0);
      const carbonFootprint = totalKWh * ENERGY.CARBON_PER_KWH * (1 - renewablePercentage / 100);
      const baselineKWh = selectedVenue.capacity * ENERGY.BASELINE_KWH_PER_CAPACITY;
      const baselineComparison = Math.max(10, Math.round(((baselineKWh - totalKWh) / baselineKWh) * 100));

      useEnergyStore.getState().updateEnergyMetrics({
        venueId: selectedVenue.id,
        totalConsumption: Math.round(totalKWh * 10) / 10,
        hvacConsumption: Math.round(hvacKWh * 10) / 10,
        lightingConsumption: Math.round(lightKWh * 10) / 10,
        digitalConsumption: Math.round(digitalKWh * 10) / 10,
        renewablePercentage: Math.round(renewablePercentage),
        carbonFootprint: Math.round(carbonFootprint * 10) / 10,
        baselineComparison,
        zones: zones.map((z) => ({
          zoneId: z.id,
          consumption: z.energyUsage,
          hvac: Math.round(z.energyUsage * ENERGY.HVAC_RATIO * 10) / 10,
          lighting: Math.round(z.energyUsage * ENERGY.LIGHTING_RATIO * 10) / 10,
          crowdDensity: z.capacity > 0 ? (z.currentOccupancy / z.capacity) * 100 : 0,
          automatedActions: z.currentOccupancy / z.capacity > 0.85 ? ['SPOT COOLING ACTIVE', 'LIGHTING MODULATION ACTIVE'] : [],
        })),
        predictiveAlerts: [],
      });

      // Inject temperature HVAC alerts dynamically
      zones.forEach(z => {
        if (tickCount % SIMULATION.ENERGY_ALERT_INTERVAL === 0 && z.temperature > SIMULATION.TEMPERATURE_ALERT_THRESHOLD) {
          useEnergyStore.getState().addPredictiveAlert({
            id: `ea-${z.id}`,
            zoneId: z.id,
            message: `${z.name} temp at ${z.temperature}°F. Projected load will trigger hotspot thermal overrun.`,
            predictedTime: 8,
            threshold: 80,
            currentValue: z.temperature,
            recommendedAction: 'Deploy medical first responders to stand standby & activate zone spot ventilation.',
          });
        }
      });
    }

    // 5. Random Incident Injector: medical / security / power outages
    const activePlay = eventPhase === 'first-half' || eventPhase === 'halftime' || eventPhase === 'second-half';
    if (activePlay && Math.random() < SIMULATION.INCIDENT_INJECTION_RATE && selectedVenue) {
      const incidentStore = useIncidentStore.getState();
      const activeIncidents = incidentStore.incidents.filter(i => i.status !== 'resolved');
      
      if (activeIncidents.length === 0) {
        const randomZone = selectedVenue.zones[Math.floor(Math.random() * selectedVenue.zones.length)];
        const types: ('medical' | 'security' | 'equipment-failure')[] = ['medical', 'security', 'equipment-failure'];
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 'medical') {
          incidentStore.createIncident({
            venueId: selectedVenue.id,
            zoneId: randomZone.id,
            type: 'medical',
            severity: 'critical',
            title: `Medical Emergency at ${randomZone.name}`,
            description: `Sensor noise spike followed by emergency help button trigger at Row F. Fall alert registered by BLE beacon tracker.`,
            assignedTo: null,
            location: `Row F, Seat 12, ${randomZone.name}`,
            respondedAt: null,
            resolvedAt: null,
          });
        } else if (type === 'security') {
          incidentStore.createIncident({
            venueId: selectedVenue.id,
            zoneId: randomZone.id,
            type: 'security',
            severity: 'warning',
            title: `Unusual crowd density convergence in ${randomZone.name}`,
            description: `Security camera visual AI detected 15+ fans loitering and blocking evacuation staircase egress routes.`,
            assignedTo: null,
            location: `Staircase 4-B, ${randomZone.name}`,
            respondedAt: null,
            resolvedAt: null,
          });
        } else {
          incidentStore.createIncident({
            venueId: selectedVenue.id,
            zoneId: randomZone.id,
            type: 'equipment-failure',
            severity: 'info',
            title: `HVAC compressor malfunction in ${randomZone.name}`,
            description: `Sensor feed reports zone damper actuator failure. Subsystem telemetry indicates degraded ventilation output.`,
            assignedTo: null,
            location: `Utility Room 112, ${randomZone.name}`,
            respondedAt: null,
            resolvedAt: null,
          });
        }
      }
    }

    // 6. Record history of Business KPIs
    if (tickCount % SIMULATION.KPI_HISTORY_INTERVAL === 0) {
      useKPIStore.getState().recordHistoricalKPI();
    }

    // Schedule next tick
    this.scheduleTick();
  }
}

export const simulationEngine = new SimulationEngine();
export default simulationEngine;
