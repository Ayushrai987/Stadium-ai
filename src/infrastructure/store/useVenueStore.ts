import { create } from 'zustand';
import { type Venue, type Zone, type Sensor } from '../../types';
import { generateVenues } from '../simulation/VenueGenerator';

interface VenueState {
  venues: Venue[];
  selectedVenueId: string;
  setVenues: (venues: Venue[]) => void;
  selectVenue: (id: string) => void;
  updateVenueZones: (venueId: string, zones: Zone[]) => void;
  updateSensorStatus: (venueId: string, zoneId: string, sensorId: string, status: Sensor['status']) => void;
  // Computed helpers
  getSelectedVenue: () => Venue | undefined;
  getSensorStats: () => { online: number; offline: number; total: number; healthPercent: number };
}

export const useVenueStore = create<VenueState>((set, get) => {
  const initialVenues = generateVenues();
  
  return {
    venues: initialVenues,
    selectedVenueId: initialVenues[0]?.id || '',
    
    setVenues: (venues) => set({ venues }),
    
    selectVenue: (id) => set({ selectedVenueId: id }),
    
    updateVenueZones: (venueId, zones) => set((state) => {
      const updatedVenues = state.venues.map((venue) => {
        if (venue.id === venueId) {
          const totalOccupancy = zones.reduce((acc, zone) => acc + zone.currentOccupancy, 0);
          
          // Calculate sensor health for the venue
          let onlineCount = 0;
          let totalSensors = 0;
          zones.forEach(z => {
            z.sensors.forEach(s => {
              totalSensors++;
              if (s.status === 'online') onlineCount++;
            });
          });
          const sensorHealth = totalSensors > 0 ? Math.round((onlineCount / totalSensors) * 100) : 100;

          return {
            ...venue,
            zones,
            currentAttendance: totalOccupancy,
            sensorHealth,
          };
        }
        return venue;
      });
      return { venues: updatedVenues };
    }),

    updateSensorStatus: (venueId, zoneId, sensorId, status) => set((state) => {
      const updatedVenues = state.venues.map((venue) => {
        if (venue.id === venueId) {
          const updatedZones = venue.zones.map((zone) => {
            if (zone.id === zoneId) {
              const updatedSensors = zone.sensors.map((sensor) => {
                if (sensor.id === sensorId) {
                  return { ...sensor, status, lastUpdated: Date.now() };
                }
                return sensor;
              });
              return { ...zone, sensors: updatedSensors };
            }
            return zone;
          });
          return { ...venue, zones: updatedZones };
        }
        return venue;
      });
      return { venues: updatedVenues };
    }),

    getSelectedVenue: () => {
      const { venues, selectedVenueId } = get();
      return venues.find((v) => v.id === selectedVenueId);
    },

    getSensorStats: () => {
      const venue = get().getSelectedVenue();
      if (!venue) return { online: 0, offline: 0, total: 0, healthPercent: 100 };
      
      let online = 0;
      let offline = 0;
      let total = 0;

      venue.zones.forEach((zone) => {
        zone.sensors.forEach((sensor) => {
          total++;
          if (sensor.status === 'online') online++;
          else offline++;
        });
      });

      const healthPercent = total > 0 ? Math.round((online / total) * 100) : 100;
      return { online, offline, total, healthPercent };
    },
  };
});
