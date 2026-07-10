// ============================================================
// Smart Stadium Platform - Core Type Definitions
// ============================================================

// --- Venue & Zone Types ---

export interface Venue {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  currentAttendance: number;
  zones: Zone[];
  status: VenueStatus;
  coordinates: { lat: number; lng: number };
  regulatoryRegion: 'GDPR' | 'CCPA' | 'OTHER';
  sensorHealth: number; // 0-100%
}

export type VenueStatus = 'operational' | 'pre-event' | 'in-event' | 'post-event' | 'maintenance' | 'emergency';

export interface Zone {
  id: string;
  venueId: string;
  name: string;
  type: ZoneType;
  capacity: number;
  currentOccupancy: number;
  temperature: number;
  humidity: number;
  airQuality: number; // AQI 0-500
  noiseLevel: number; // dB
  energyUsage: number; // kWh
  queueTime: number; // minutes
  predictedQueueTime: number; // 15 min forecast
  sensors: Sensor[];
  alerts: ZoneAlert[];
}

export type ZoneType = 'seating' | 'concourse' | 'concession' | 'restroom' | 'entrance' | 'exit' | 'vip' | 'field' | 'parking' | 'medical';

export interface ZoneAlert {
  id: string;
  type: 'capacity' | 'temperature' | 'air-quality' | 'queue' | 'sensor-failure' | 'security';
  severity: AlertSeverity;
  message: string;
  timestamp: number;
  acknowledged: boolean;
}

export type AlertSeverity = 'info' | 'warning' | 'critical' | 'emergency';

// --- Sensor Types ---

export interface Sensor {
  id: string;
  zoneId: string;
  type: SensorType;
  status: SensorStatus;
  lastReading: number;
  lastUpdated: number;
  battery: number; // 0-100%
  accuracy: number; // 0-100%
}

export type SensorType = 'crowd-counter' | 'temperature' | 'humidity' | 'air-quality' | 'noise' | 'ble-beacon' | 'camera' | 'pressure' | 'light' | 'motion';

export type SensorStatus = 'online' | 'offline' | 'degraded' | 'calibrating';

// --- Incident Types ---

export interface Incident {
  id: string;
  venueId: string;
  zoneId: string;
  type: IncidentType;
  severity: AlertSeverity;
  title: string;
  description: string;
  status: IncidentStatus;
  detectedAt: number;
  alertedAt: number;
  respondedAt: number | null;
  resolvedAt: number | null;
  assignedTo: string | null;
  automatedActions: AutomatedAction[];
  decisionAuditTrail: DecisionRecord[];
  location: string;
}

export type IncidentType = 'medical' | 'security' | 'fire' | 'weather' | 'power-outage' | 'crowd-surge' | 'equipment-failure' | 'cyber';

export type IncidentStatus = 'detected' | 'alerting' | 'responding' | 'in-progress' | 'resolved' | 'closed';

export interface AutomatedAction {
  id: string;
  action: string;
  timestamp: number;
  status: 'pending' | 'executed' | 'failed';
  result: string;
}

export interface DecisionRecord {
  timestamp: number;
  decision: string;
  rationale: string;
  dataInputs: string[];
  outcome: string;
  madeBy: 'system' | 'operator';
}

// --- Fan Types ---

export interface FanProfile {
  id: string;
  name: string;
  seatSection: string;
  seatRow: string;
  seatNumber: string;
  preferences: FanPreferences;
  currentLocation: { zoneId: string; x: number; y: number };
  visitHistory: VisitRecord[];
  friends: FriendLocation[];
  privacySettings: PrivacySettings;
  accessibilityNeeds: AccessibilityNeeds;
}

export interface FanPreferences {
  favoriteFood: string[];
  favoriteDrinks: string[];
  dietaryRestrictions: string[];
  preferredConcessions: string[];
  budgetRange: 'economy' | 'standard' | 'premium';
  notificationFrequency: 'minimal' | 'moderate' | 'frequent';
}

export interface VisitRecord {
  date: number;
  venueId: string;
  purchases: PurchaseRecord[];
  feedbackScore: number;
}

export interface PurchaseRecord {
  item: string;
  price: number;
  concession: string;
  timestamp: number;
}

export interface FriendLocation {
  id: string;
  name: string;
  avatar: string;
  zoneId: string;
  distance: number; // meters
}

export interface PrivacySettings {
  locationSharing: boolean;
  preferenceLearning: boolean;
  friendVisibility: boolean;
  personalizedOffers: boolean;
  dataExportRequested: boolean;
}

export interface AccessibilityNeeds {
  visualImpairment: boolean;
  hearingImpairment: boolean;
  mobilityImpairment: boolean;
  audioNavigation: boolean;
  captioning: boolean;
  accessibleRoutes: boolean;
}

// --- Recommendation Types ---

export interface Recommendation {
  id: string;
  type: 'food' | 'drink' | 'navigation' | 'experience' | 'social';
  title: string;
  description: string;
  location: string;
  zoneId: string;
  estimatedWaitTime: number;
  discount: number | null; // percentage
  expiresIn: number; // minutes
  confidence: number; // 0-100%
  accepted: boolean | null;
  revenue: number;
}

// --- Energy & Sustainability Types ---

export interface EnergyMetrics {
  venueId: string;
  totalConsumption: number; // kWh
  hvacConsumption: number;
  lightingConsumption: number;
  digitalConsumption: number;
  renewablePercentage: number;
  carbonFootprint: number; // kg CO2
  baselineComparison: number; // % vs conventional
  zones: ZoneEnergy[];
  predictiveAlerts: EnergyAlert[];
}

export interface ZoneEnergy {
  zoneId: string;
  consumption: number;
  hvac: number;
  lighting: number;
  crowdDensity: number;
  automatedActions: string[];
}

export interface EnergyAlert {
  id: string;
  zoneId: string;
  message: string;
  predictedTime: number; // minutes until threshold
  threshold: number;
  currentValue: number;
  recommendedAction: string;
}

// --- Tournament Types ---

export interface Tournament {
  id: string;
  name: string;
  venues: Venue[];
  activeIncidents: Incident[];
  totalAttendance: number;
  overallCapacityPercent: number;
  resourceAllocation: ResourceAllocation[];
  playbooks: TournamentPlaybook[];
  complianceStatus: ComplianceStatus[];
}

export interface ResourceAllocation {
  id: string;
  type: 'medical' | 'security' | 'maintenance' | 'logistics';
  currentVenueId: string;
  targetVenueId: string | null;
  status: 'available' | 'deployed' | 'en-route' | 'busy';
  eta: number | null; // minutes
  teamName: string;
}

export interface TournamentPlaybook {
  id: string;
  name: string;
  scenario: string;
  triggerConditions: string[];
  automatedResponses: string[];
  humanDecisionPoints: string[];
  outcomePrediction: string;
  status: 'inactive' | 'active' | 'triggered' | 'resolved';
}

export interface ComplianceStatus {
  venueId: string;
  region: 'GDPR' | 'CCPA' | 'OTHER';
  dataTypesCollected: string[];
  retentionDays: number;
  consentRate: number; // percentage
  pendingDeletions: number;
  lastAudit: number;
  status: 'compliant' | 'review-needed' | 'non-compliant';
}

// --- KPI Types ---

export interface OperationalKPIs {
  queueTimeReduction: { before: number; after: number; percentChange: number };
  revenueLift: { baseline: number; current: number; percentChange: number; conversionRate: number };
  emergencyResponseTime: { detection: number; alert: number; staffArrival: number; total: number; baseline: number };
  energySavings: { current: number; baseline: number; percentSaved: number; carbonReduced: number };
  fanSatisfaction: number; // 0-100
  sensorUptime: number; // 0-100%
  incidentResolutionRate: number; // percentage resolved within SLA
}

// --- Time Series Data ---

export interface TimeSeriesPoint {
  timestamp: number;
  value: number;
}

export interface ZoneTimeSeries {
  zoneId: string;
  metric: string;
  data: TimeSeriesPoint[];
}

// --- Audit Log Types ---

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  action: string;
  actor: string;
  actorRole: 'system' | 'operator' | 'admin' | 'fan';
  resource: string;
  resourceType: string;
  details: string;
  ipAddress: string;
  result: 'success' | 'failure' | 'denied';
}

// --- Simulation State ---

export interface SimulationState {
  isRunning: boolean;
  speed: number; // 1x, 2x, 5x
  currentTime: number;
  eventPhase: EventPhase;
  tickCount: number;
}

export type EventPhase = 'pre-event' | 'gates-open' | 'filling' | 'first-half' | 'halftime' | 'second-half' | 'overtime' | 'post-event';
