import { describe, it, expect } from 'vitest';
import { generateSensorReadings } from '../../infrastructure/simulation/SensorSimulator';
import { generateDefaultVenue } from '../../infrastructure/simulation/VenueGenerator';

describe('Sensor Telemetry Simulator', () => {
  it('should adjust occupancy values based on event phase', () => {
    const venue = generateDefaultVenue();
    
    // Test pre-event occupancy (very low)
    const preReadings = generateSensorReadings(venue.zones, 'pre-event', 0);
    const preSeat = preReadings.find(z => z.type === 'seating')!;
    const preOccupancyPercent = preSeat.currentOccupancy / preSeat.capacity;
    expect(preOccupancyPercent).toBeLessThan(0.2);

    // Test first-half occupancy (very high)
    const activeReadings = generateSensorReadings(venue.zones, 'first-half', 10);
    const activeSeat = activeReadings.find(z => z.type === 'seating')!;
    const activeOccupancyPercent = activeSeat.currentOccupancy / activeSeat.capacity;
    expect(activeOccupancyPercent).toBeGreaterThan(0.7);
  });

  it('should surge concession occupancy during halftime', () => {
    const venue = generateDefaultVenue();
    
    // Play phase -> concessions should be quiet
    const playReadings = generateSensorReadings(venue.zones, 'first-half', 10);
    const playConcession = playReadings.find(z => z.type === 'concession')!;
    
    // Halftime phase -> concessions should surge
    const halfReadings = generateSensorReadings(venue.zones, 'halftime', 120);
    const halfConcession = halfReadings.find(z => z.type === 'concession')!;
    
    expect(halfConcession.currentOccupancy).toBeGreaterThan(playConcession.currentOccupancy);
  });

  it('should simulate battery status and update sensors correctly', () => {
    const venue = generateDefaultVenue();
    const tickCount = 5;
    const readings = generateSensorReadings(venue.zones, 'first-half', tickCount);
    
    readings.forEach(zone => {
      zone.sensors.forEach(sensor => {
        expect(sensor.battery).toBeGreaterThanOrEqual(0);
        expect(sensor.battery).toBeLessThanOrEqual(100);
        expect(sensor.lastUpdated).toBeDefined();
      });
    });
  });
});
