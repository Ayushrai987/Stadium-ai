import { describe, it, expect } from 'vitest';
import { generateVenues, generateDefaultVenue } from '../../infrastructure/simulation/VenueGenerator';

describe('Venue Generator Telemetry Setup', () => {
  it('should generate multiple stadium venues', () => {
    const venues = generateVenues();
    expect(venues.length).toBeGreaterThanOrEqual(3);
    
    const metlife = venues[0];
    expect(metlife.name).toBe('MetLife Stadium');
    expect(metlife.capacity).toBe(82500);
    expect(metlife.regulatoryRegion).toBe('OTHER'); // US state laws (NJ)
  });

  it('should generate valid zones for each venue', () => {
    const venues = generateVenues();
    
    venues.forEach(venue => {
      expect(venue.zones.length).toBeGreaterThan(0);
      
      venue.zones.forEach(zone => {
        expect(zone.venueId).toBe(venue.id);
        expect(zone.capacity).toBeGreaterThan(0);
        expect(zone.sensors.length).toBeGreaterThanOrEqual(3); // counter, temp, humidity
      });
    });
  });

  it('should generate default venue correctly', () => {
    const defaultVenue = generateDefaultVenue();
    expect(defaultVenue).toBeDefined();
    expect(defaultVenue.id).toBe('venue-metlife');
  });
});
