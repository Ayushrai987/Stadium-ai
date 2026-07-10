import { type Venue, type Recommendation, type FanProfile } from '../../types';

/**
 * Mock AI scoring algorithm generating personalized stadium recommendations
 * dynamically based on live queue times, crowd densities, preferences, and event phases.
 */
export class RecommendationEngine {
  /**
   * Generates scored recommendations for a fan at a given venue.
   */
  static getRecommendations(
    venue: Venue,
    fan: FanProfile,
    eventPhase: string
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // 1. Check concession queues and generate food/drink recommendations
    const concessions = venue.zones.filter(z => z.type === 'concession');
    
    concessions.forEach(concession => {
      // Base score on queue time (lower queue = higher score)
      let score = 100 - concession.queueTime * 5;
      
      // Personalize based on fan preferences
      const hasPref = fan.preferences.favoriteFood.some(fav => 
        concession.name.toLowerCase().includes(fav.toLowerCase())
      );
      if (hasPref) score += 20;

      // Adjust based on event phase
      if (eventPhase === 'halftime') {
        // Halftime concession queues are packed, promote fast lanes or less busy zones
        if (concession.queueTime < 5) score += 15;
      }

      // Generate recommendation if confidence is reasonable
      if (score > 60) {
        recommendations.push({
          id: `rec-food-${concession.id}`,
          type: 'food',
          title: `Smart Lane: ${concession.name}`,
          description: `Wait time is only ${concession.queueTime} mins. Grab food now before the rush!`,
          location: concession.name,
          zoneId: concession.id,
          estimatedWaitTime: concession.queueTime,
          discount: concession.queueTime > 8 ? 20 : null, // discount to distribute crowd if line is long
          expiresIn: 10,
          confidence: Math.min(99, Math.max(50, score)),
          accepted: null,
          revenue: 12.50
        });
      }
    });

    // 2. Navigation recommendations based on ingress/egress crowd spikes
    const exits = venue.zones.filter(z => z.type === 'exit' || z.type === 'entrance');
    exits.forEach(exit => {
      const occupancyPercent = exit.capacity > 0 ? (exit.currentOccupancy / exit.capacity) * 100 : 0;
      
      if (occupancyPercent > 85 && (eventPhase === 'post-event' || eventPhase === 'gates-open')) {
        recommendations.push({
          id: `rec-nav-${exit.id}`,
          type: 'navigation',
          title: `Alternative Route: Avoid ${exit.name}`,
          description: `${exit.name} is experiencing heavy traffic (${Math.round(occupancyPercent)}% density). Use West gate bypass instead.`,
          location: 'West Gate Bypass',
          zoneId: exit.id,
          estimatedWaitTime: Math.round(occupancyPercent / 10),
          discount: null,
          expiresIn: 15,
          confidence: 90,
          accepted: null,
          revenue: 0
        });
      }
    });

    // 3. Social recommendations (friends distance)
    fan.friends.forEach(friend => {
      const friendZone = venue.zones.find(z => z.id === friend.zoneId);
      if (friendZone && friend.distance < 100) {
        recommendations.push({
          id: `rec-social-${friend.id}`,
          type: 'social',
          title: `Meet up with ${friend.name}`,
          description: `${friend.name} is only ${friend.distance}m away in ${friendZone.name}. Meet up now?`,
          location: friendZone.name,
          zoneId: friendZone.id,
          estimatedWaitTime: 0,
          discount: null,
          expiresIn: 30,
          confidence: 85,
          accepted: null,
          revenue: 0
        });
      }
    });

    // Sort by confidence descending
    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }
}
