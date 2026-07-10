import { type Zone, type EventPhase } from '../../types';

export function generateSensorReadings(
  zones: Zone[],
  eventPhase: EventPhase,
  _tickCount: number
): Zone[] {
  // Determine baseline variables based on event phase
  let attendanceModifier = 0.05; // pre-event
  let activityModifier = 0.1; // quiet
  
  switch (eventPhase) {
    case 'gates-open':
      attendanceModifier = 0.25;
      activityModifier = 0.3;
      break;
    case 'filling':
      attendanceModifier = 0.6;
      activityModifier = 0.5;
      break;
    case 'first-half':
      attendanceModifier = 0.92;
      activityModifier = 0.85;
      break;
    case 'halftime':
      attendanceModifier = 0.95;
      activityModifier = 1.0; // concession rush
      break;
    case 'second-half':
      attendanceModifier = 0.94;
      activityModifier = 0.9;
      break;
    case 'overtime':
      attendanceModifier = 0.90;
      activityModifier = 0.95;
      break;
    case 'post-event':
      attendanceModifier = 0.3; // egress
      activityModifier = 0.4;
      break;
  }

  return zones.map((zone) => {
    // 1. Crowd occupancy simulation
    let occupancyPercent = attendanceModifier;
    
    // Concessions and restrooms surge at halftime and pre-game
    if (zone.type === 'concession' || zone.type === 'restroom') {
      if (eventPhase === 'halftime') {
        occupancyPercent = 0.95;
      } else if (eventPhase === 'gates-open' || eventPhase === 'filling') {
        occupancyPercent = 0.4;
      } else if (eventPhase === 'first-half' || eventPhase === 'second-half') {
        occupancyPercent = 0.2; // quiet during play
      } else {
        occupancyPercent = 0.05;
      }
    } else if (zone.type === 'entrance' || zone.type === 'exit') {
      if (eventPhase === 'gates-open' || eventPhase === 'filling') {
        occupancyPercent = 0.8;
      } else if (eventPhase === 'post-event') {
        occupancyPercent = 0.95;
      } else {
        occupancyPercent = 0.05;
      }
    }

    // Add some random noise to crowd occupancy (±5%)
    const crowdNoise = (Math.random() - 0.5) * 10;
    const finalOccupancy = Math.max(
      0,
      Math.min(
        zone.capacity,
        Math.round(zone.capacity * occupancyPercent + crowdNoise)
      )
    );

    // Calculate percent full
    const currentDensityPercent = zone.capacity > 0 ? (finalOccupancy / zone.capacity) * 100 : 0;

    // 2. Temp simulation (affected by crowd density)
    // base temp = 70°F. In seating decks under full crowd, temp goes up to 82°F.
    const heatLoad = currentDensityPercent * 0.12; // up to 12 degrees heat load
    const baseTemp = 70 + (Math.random() - 0.5) * 1.5;
    const finalTemp = Math.round((baseTemp + heatLoad) * 10) / 10;

    // 3. Humidity simulation
    const finalHumidity = Math.round(50 + (Math.random() - 0.5) * 4 + currentDensityPercent * 0.08);

    // 4. Air Quality (worse when crowded)
    const finalAQI = Math.round(35 + currentDensityPercent * 0.6 + (Math.random() - 0.5) * 10);

    // 5. Noise levels (dB) - base 60dB. Full stadium seating during play can reach 105dB.
    let noiseBase = 55;
    if (zone.type === 'seating' || zone.type === 'vip') {
      noiseBase = 65 + activityModifier * 30; // base + up to 30dB based on game play
    } else if (zone.type === 'concourse' || zone.type === 'concession') {
      noiseBase = 60 + activityModifier * 20;
    }
    const finalNoise = Math.round(noiseBase + (Math.random() - 0.5) * 5);

    // 6. Queue time simulation (concession / entrances)
    let finalQueue = 0;
    if (zone.type === 'concession' || zone.type === 'restroom' || zone.type === 'entrance') {
      // base queue time formula based on occupancy
      finalQueue = Math.max(0, Math.round((currentDensityPercent * currentDensityPercent) * 0.0025));
    }
    
    // 15-minute queue prediction (simple trend prediction + random surge factor)
    const trendFactor = eventPhase === 'filling' || eventPhase === 'halftime' ? 1.2 : 0.8;
    const finalPredictedQueue = Math.max(0, Math.round(finalQueue * trendFactor + (Math.random() - 0.3) * 2));

    // 7. Energy usage simulation (kWh)
    // Base HVAC + lighting, scaled by crowd density for cooling
    const baseHVAC = zone.capacity * 0.02; // watts per capacity seat
    const coolingLoad = currentDensityPercent > 70 ? (currentDensityPercent - 70) * 0.05 : 0;
    const finalEnergy = Math.round((baseHVAC * (1 + coolingLoad) + 5 + Math.random() * 2) * 10) / 10;

    // 8. Update individual sensors list and statuses
    const updatedSensors = zone.sensors.map((sensor) => {
      let status = sensor.status;
      let lastReading = sensor.lastReading;

      // Random sensor degradation / offline logic (5% chance to toggle state every few hundred ticks)
      const shouldToggle = Math.random() < 0.005;
      if (shouldToggle) {
        if (status === 'online') {
          status = Math.random() < 0.3 ? 'degraded' : 'offline';
        } else {
          status = 'online';
        }
      }

      // Map sensor readings
      if (status === 'online' || status === 'degraded') {
        switch (sensor.type) {
          case 'crowd-counter':
          case 'camera':
            lastReading = finalOccupancy;
            break;
          case 'temperature':
            lastReading = finalTemp;
            break;
          case 'humidity':
            lastReading = finalHumidity;
            break;
          case 'noise':
            lastReading = finalNoise;
            break;
          case 'air-quality':
            lastReading = finalAQI;
            break;
          case 'pressure':
            lastReading = finalQueue;
            break;
          default:
            lastReading = 1;
        }
      }

      // Lower battery slowly
      const newBattery = Math.max(0, sensor.battery - (Math.random() < 0.05 ? 1 : 0));

      return {
        ...sensor,
        status,
        lastReading,
        battery: newBattery,
        lastUpdated: Date.now(),
      };
    });

    return {
      ...zone,
      currentOccupancy: finalOccupancy,
      temperature: finalTemp,
      humidity: finalHumidity,
      airQuality: finalAQI,
      noiseLevel: finalNoise,
      queueTime: finalQueue,
      predictedQueueTime: finalPredictedQueue,
      energyUsage: finalEnergy,
      sensors: updatedSensors,
    };
  });
}
