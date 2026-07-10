import { describe, it, expect, beforeEach } from 'vitest';
import { useVenueStore } from '../../infrastructure/store/useVenueStore';
import { useIncidentStore } from '../../infrastructure/store/useIncidentStore';
import { useCrowdStore } from '../../infrastructure/store/useCrowdStore';
import { useEnergyStore } from '../../infrastructure/store/useEnergyStore';
import { useKPIStore } from '../../infrastructure/store/useKPIStore';
import { useSimulationStore } from '../../infrastructure/store/useSimulationStore';

describe('Zustand Stores Integration Flow', () => {
  beforeEach(() => {
    // Reset stores to initial states before each test run
    useVenueStore.setState({ selectedVenueId: 'venue-metlife' });
    useIncidentStore.setState({ incidents: [], activeIncidentId: null });
    useCrowdStore.setState({ history: {}, anomalies: [] });
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
    useSimulationStore.setState({
      isRunning: false,
      speed: 1,
      currentTime: 1000000,
      eventPhase: 'pre-event',
      tickCount: 0,
    });
  });

  describe('useVenueStore', () => {
    it('should select venue and return stats', () => {
      const store = useVenueStore.getState();
      expect(store.selectedVenueId).toBe('venue-metlife');
      
      store.selectVenue('venue-sofi');
      expect(useVenueStore.getState().selectedVenueId).toBe('venue-sofi');
      
      const stats = store.getSensorStats();
      expect(stats.total).toBeGreaterThan(0);
      expect(stats.online).toBeGreaterThanOrEqual(0);
    });

    it('should return default stats when no venue is found', () => {
      useVenueStore.setState({ selectedVenueId: 'invalid-id' });
      const stats = useVenueStore.getState().getSensorStats();
      expect(stats).toEqual({ online: 0, offline: 0, total: 0, healthPercent: 100 });
      expect(useVenueStore.getState().getSelectedVenue()).toBeUndefined();
    });

    it('should update sensor status and update timestamp', () => {
      const store = useVenueStore.getState();
      const venueId = 'venue-metlife';
      const venue = store.getSelectedVenue()!;
      const zone = venue.zones[0];
      const sensor = zone.sensors[0];

      expect(sensor.status).toBe('online');

      store.updateSensorStatus(venueId, zone.id, sensor.id, 'offline');
      
      const updatedVenue = useVenueStore.getState().getSelectedVenue()!;
      const updatedSensor = updatedVenue.zones[0].sensors[0];
      expect(updatedSensor.status).toBe('offline');
      expect(updatedSensor.lastUpdated).toBeDefined();
    });

    it('should update venue zones and recalculate occupancy/health', () => {
      const store = useVenueStore.getState();
      const venue = store.getSelectedVenue()!;
      
      const modifiedZones = venue.zones.map(z => ({
        ...z,
        currentOccupancy: 200,
        sensors: z.sensors.map(s => ({ ...s, status: 'offline' as const })),
      }));

      store.updateVenueZones(venue.id, modifiedZones);

      const updatedVenue = useVenueStore.getState().getSelectedVenue()!;
      expect(updatedVenue.currentAttendance).toBe(modifiedZones.length * 200);
      expect(updatedVenue.sensorHealth).toBe(0); // All offline
    });
  });

  describe('useIncidentStore', () => {
    it('should handle incident lifecycle with playbooks and audit logging', () => {
      const store = useIncidentStore.getState();
      expect(store.incidents).toHaveLength(0);

      // 1. Create Incident
      store.createIncident({
        venueId: 'venue-metlife',
        zoneId: 'zone-north-upper',
        type: 'medical',
        severity: 'critical',
        title: 'Fall Incident',
        description: 'Spectator slipped on staircase 4',
        assignedTo: null,
        location: 'Section 102, Row B',
        respondedAt: null,
        resolvedAt: null,
      });

      const activeIncidents = useIncidentStore.getState().incidents;
      expect(activeIncidents).toHaveLength(1);
      const inc = activeIncidents[0];
      expect(inc.status).toBe('detected');
      expect(inc.decisionAuditTrail).toHaveLength(1); // auto-generated log entry

      // 2. Acknowledge Incident
      store.acknowledgeIncident(inc.id);
      let updatedInc = useIncidentStore.getState().incidents[0];
      expect(updatedInc.status).toBe('responding');
      expect(updatedInc.decisionAuditTrail).toHaveLength(2); // acknowledged log entry

      // 3. Resolve Incident
      store.resolveIncident(inc.id);
      updatedInc = useIncidentStore.getState().incidents[0];
      expect(updatedInc.status).toBe('resolved');
      expect(updatedInc.resolvedAt).toBeDefined();
    });

    it('should support manual status update, assign staff, and custom decision records', () => {
      const store = useIncidentStore.getState();
      store.createIncident({
        venueId: 'venue-metlife',
        zoneId: 'zone-north-upper',
        type: 'security',
        severity: 'warning',
        title: 'Suspicious Bag',
        description: 'Unattended bag under seat',
        assignedTo: null,
        location: 'Section 104',
        respondedAt: null,
        resolvedAt: null,
      });

      const inc = useIncidentStore.getState().incidents[0];
      
      // Update status
      store.updateIncidentStatus(inc.id, 'in-progress');
      expect(useIncidentStore.getState().incidents[0].status).toBe('in-progress');

      // Assign staff
      store.assignIncident(inc.id, 'Officer Dave');
      expect(useIncidentStore.getState().incidents[0].assignedTo).toBe('Officer Dave');

      // Add decision record
      store.addDecisionRecord(inc.id, {
        timestamp: Date.now(),
        decision: 'Bomb squad standby',
        rationale: 'Preventative measure',
        dataInputs: ['Operator input'],
        outcome: 'Standby ordered',
        madeBy: 'operator',
      });
      expect(useIncidentStore.getState().incidents[0].decisionAuditTrail).toHaveLength(4);
    });

    it('should support executing automated actions', () => {
      const store = useIncidentStore.getState();
      store.createIncident({
        venueId: 'venue-metlife',
        zoneId: 'zone-north-upper',
        type: 'equipment-failure',
        severity: 'info',
        title: 'Damper stuck',
        description: 'Damper stuck closed',
        assignedTo: null,
        location: 'Aisle N HVAC',
        respondedAt: null,
        resolvedAt: null,
      });

      const inc = useIncidentStore.getState().incidents[0];
      const actionId = inc.automatedActions[0].id;

      store.executeAutomatedAction(inc.id, actionId, 'executed', 'Success message');

      const updatedInc = useIncidentStore.getState().incidents[0];
      expect(updatedInc.automatedActions[0].status).toBe('executed');
      expect(updatedInc.automatedActions[0].result).toBe('Success message');
    });
  });

  describe('useCrowdStore', () => {
    it('should record points and enforce buffer ring size limits', () => {
      const store = useCrowdStore.getState();
      const zoneId = 'zone-test';

      store.addHistoryPoint(zoneId, 45, 2);
      expect(useCrowdStore.getState().history[zoneId]).toHaveLength(1);

      // Add more history points than the ring buffer limit (200)
      for (let i = 0; i < 210; i++) {
        useCrowdStore.getState().addHistoryPoint(zoneId, 50 + (i % 10), 1);
      }

      // Buffer should clamp at MAX_HISTORY_POINTS (200)
      expect(useCrowdStore.getState().history[zoneId].length).toBeLessThanOrEqual(200);
    });

    it('should record and list crowd anomalies', () => {
      const store = useCrowdStore.getState();
      expect(store.anomalies).toHaveLength(0);

      store.addAnomaly('zone-1', 'Crowd surge detected');
      expect(useCrowdStore.getState().anomalies).toHaveLength(1);
      expect(useCrowdStore.getState().anomalies[0].zoneId).toBe('zone-1');
    });
  });

  describe('useEnergyStore', () => {
    it('should update energy metrics and save alerts', () => {
      const store = useEnergyStore.getState();
      expect(store.metrics).toBeNull();

      const mockMetrics = {
        venueId: 'venue-metlife',
        totalConsumption: 450,
        hvacConsumption: 300,
        lightingConsumption: 100,
        digitalConsumption: 50,
        renewablePercentage: 40,
        carbonFootprint: 180,
        baselineComparison: 15,
        zones: [],
        predictiveAlerts: [],
      };

      store.updateEnergyMetrics(mockMetrics);
      expect(useEnergyStore.getState().metrics).toEqual(mockMetrics);
    });
  });

  describe('useKPIStore', () => {
    it('should initialize with default KPIs and support updating', () => {
      const store = useKPIStore.getState();
      expect(store.kpis.fanSatisfaction).toBe(88);

      store.updateKPIs((prev) => ({
        ...prev,
        fanSatisfaction: 95,
      }));

      expect(useKPIStore.getState().kpis.fanSatisfaction).toBe(95);
    });

    it('should support recording historical KPIs up to 60 items limit', () => {
      const store = useKPIStore.getState();
      expect(store.historicalKPIs).toHaveLength(0);

      store.recordHistoricalKPI();
      expect(useKPIStore.getState().historicalKPIs).toHaveLength(1);

      // Record more than 60 times
      for (let i = 0; i < 70; i++) {
        useKPIStore.getState().recordHistoricalKPI();
      }

      expect(useKPIStore.getState().historicalKPIs.length).toBe(60);
    });
  });

  describe('useSimulationStore', () => {
    it('should handle start, stop, speed adjustment, phase transitions, and resets', () => {
      const store = useSimulationStore.getState();
      expect(store.isRunning).toBe(false);

      store.start();
      expect(useSimulationStore.getState().isRunning).toBe(true);

      store.stop();
      expect(useSimulationStore.getState().isRunning).toBe(false);

      store.setSpeed(5);
      expect(useSimulationStore.getState().speed).toBe(5);

      expect(store.eventPhase).toBe('pre-event');
      store.nextPhase();
      expect(useSimulationStore.getState().eventPhase).toBe('gates-open');

      store.setPhase('first-half');
      expect(useSimulationStore.getState().eventPhase).toBe('first-half');

      store.tick();
      expect(useSimulationStore.getState().tickCount).toBe(1);
      // currentTime increases by speed * 1000
      expect(useSimulationStore.getState().currentTime).toBe(1000000 + 5000);

      store.reset();
      expect(useSimulationStore.getState().isRunning).toBe(false);
      expect(useSimulationStore.getState().speed).toBe(1);
      expect(useSimulationStore.getState().tickCount).toBe(0);
      expect(useSimulationStore.getState().eventPhase).toBe('pre-event');
    });
  });
});
