import { type Venue, type Zone, type Sensor, type ZoneType, type SensorType } from '../../types';

function generateRandomId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

function createSensor(zoneId: string, type: SensorType): Sensor {
  return {
    id: generateRandomId('sensor'),
    zoneId,
    type,
    status: 'online',
    lastReading: 0,
    lastUpdated: Date.now(),
    battery: Math.floor(Math.random() * 30) + 70, // 70-100%
    accuracy: Math.floor(Math.random() * 10) + 90, // 90-100%
  };
}

function createZone(venueId: string, name: string, type: ZoneType, capacity: number): Zone {
  const zoneId = generateRandomId('zone');
  
  // Set up standard sensors based on zone type
  const sensors: Sensor[] = [
    createSensor(zoneId, 'crowd-counter'),
    createSensor(zoneId, 'temperature'),
    createSensor(zoneId, 'humidity'),
  ];

  if (type === 'concourse' || type === 'entrance' || type === 'exit') {
    sensors.push(createSensor(zoneId, 'ble-beacon'));
    sensors.push(createSensor(zoneId, 'camera'));
  }

  if (type === 'seating' || type === 'vip') {
    sensors.push(createSensor(zoneId, 'noise'));
    sensors.push(createSensor(zoneId, 'camera'));
  }

  if (type === 'concession') {
    sensors.push(createSensor(zoneId, 'pressure')); // For scale/weights or queue tracking
    sensors.push(createSensor(zoneId, 'ble-beacon'));
  }

  return {
    id: zoneId,
    venueId,
    name,
    type,
    capacity,
    currentOccupancy: 0,
    temperature: 72,
    humidity: 50,
    airQuality: 45,
    noiseLevel: 65,
    energyUsage: 0,
    queueTime: 0,
    predictedQueueTime: 0,
    sensors,
    alerts: [],
  };
}

export function generateVenues(): Venue[] {
  const venues: Venue[] = [];

  // MetLife Stadium (Main Primary Venue)
  const metLifeId = 'venue-metlife';
  const metLifeZones: Zone[] = [
    createZone(metLifeId, 'North Upper Stand', 'seating', 12000),
    createZone(metLifeId, 'North Lower Stand', 'seating', 8000),
    createZone(metLifeId, 'South Upper Stand', 'seating', 12000),
    createZone(metLifeId, 'South Lower Stand', 'seating', 8000),
    createZone(metLifeId, 'East Upper Deck', 'seating', 15000),
    createZone(metLifeId, 'West Upper Deck', 'seating', 15000),
    createZone(metLifeId, 'North-East Concourse', 'concourse', 3000),
    createZone(metLifeId, 'North-West Concourse', 'concourse', 3000),
    createZone(metLifeId, 'South-East Concourse', 'concourse', 3000),
    createZone(metLifeId, 'South-West Concourse', 'concourse', 3000),
    createZone(metLifeId, 'Aisle N Concessions', 'concession', 500),
    createZone(metLifeId, 'Aisle S Concessions', 'concession', 500),
  ];
  // Rename specific zones for clear UI identifiers
  metLifeZones[0].id = 'zone-north-upper';
  metLifeZones[1].id = 'zone-north-lower';
  metLifeZones[2].id = 'zone-south-upper';
  metLifeZones[3].id = 'zone-south-lower';
  metLifeZones[4].id = 'zone-east-upper';
  metLifeZones[5].id = 'zone-west-upper';
  metLifeZones[6].id = 'zone-ne-concourse';
  metLifeZones[7].id = 'zone-nw-concourse';
  metLifeZones[8].id = 'zone-se-concourse';
  metLifeZones[9].id = 'zone-sw-concourse';
  metLifeZones[10].id = 'zone-concession-north';
  metLifeZones[11].id = 'zone-concession-south';

  // Fix sensor zone references
  metLifeZones.forEach(z => z.sensors.forEach(s => s.zoneId = z.id));

  venues.push({
    id: metLifeId,
    name: 'MetLife Stadium',
    city: 'East Rutherford',
    country: 'USA',
    capacity: 82500,
    currentAttendance: 0,
    zones: metLifeZones,
    status: 'pre-event',
    coordinates: { lat: 40.8135, lng: -74.0743 },
    regulatoryRegion: 'OTHER', // US state laws
    sensorHealth: 100,
  });

  // SoFi Stadium
  const sofiId = 'venue-sofi';
  const sofiZones = [
    createZone(sofiId, 'Level 1 Bowl', 'seating', 15000),
    createZone(sofiId, 'Level 4 Bowl', 'seating', 25000),
    createZone(sofiId, 'VIP Suites', 'vip', 5000),
    createZone(sofiId, 'Concourse Walkway', 'concourse', 8000),
    createZone(sofiId, 'Gate A Entrance', 'entrance', 4000),
    createZone(sofiId, 'Canyon Concessions', 'concession', 800),
  ];
  venues.push({
    id: sofiId,
    name: 'SoFi Stadium',
    city: 'Los Angeles',
    country: 'USA',
    capacity: 70240,
    currentAttendance: 0,
    zones: sofiZones,
    status: 'pre-event',
    coordinates: { lat: 33.9534, lng: -118.3387 },
    regulatoryRegion: 'CCPA',
    sensorHealth: 100,
  });

  // Estadio Azteca
  const aztecaId = 'venue-azteca';
  const aztecaZones = [
    createZone(aztecaId, 'General Stand A', 'seating', 35000),
    createZone(aztecaId, 'General Stand B', 'seating', 30000),
    createZone(aztecaId, 'Upper Deck Plazas', 'seating', 15000),
    createZone(aztecaId, 'Main Ring Concourse', 'concourse', 5000),
    createZone(aztecaId, 'Taco Plaza Concessions', 'concession', 1000),
  ];
  venues.push({
    id: aztecaId,
    name: 'Estadio Azteca',
    city: 'Mexico City',
    country: 'Mexico',
    capacity: 87523,
    currentAttendance: 0,
    zones: aztecaZones,
    status: 'pre-event',
    coordinates: { lat: 19.3029, lng: -99.1505 },
    regulatoryRegion: 'OTHER',
    sensorHealth: 100,
  });

  // BMO Field
  const bmoId = 'venue-bmo';
  const bmoZones = [
    createZone(bmoId, 'East Stands', 'seating', 10000),
    createZone(bmoId, 'West Stands', 'seating', 10000),
    createZone(bmoId, 'South Supporters Stand', 'seating', 6000),
    createZone(bmoId, 'Main Food Hall', 'concession', 600),
  ];
  venues.push({
    id: bmoId,
    name: 'BMO Field',
    city: 'Toronto',
    country: 'Canada',
    capacity: 30000,
    currentAttendance: 0,
    zones: bmoZones,
    status: 'pre-event',
    coordinates: { lat: 43.6328, lng: -79.4186 },
    regulatoryRegion: 'OTHER',
    sensorHealth: 100,
  });

  return venues;
}

export function generateDefaultVenue(): Venue {
  return generateVenues()[0];
}
