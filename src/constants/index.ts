// ============================================================
// Smart Stadium Platform — Constants & Configuration
// ============================================================

// --- Simulation Tuning ---
export const SIMULATION = {
  /** Minimum interval between ticks in ms (at max speed) */
  MIN_TICK_INTERVAL_MS: 200,
  /** Base interval between ticks at 1x speed */
  BASE_TICK_INTERVAL_MS: 1000,
  /** Ticks between automatic phase transitions */
  PHASE_TRANSITION_TICKS: 120,
  /** Probability of incident injection per tick during active play */
  INCIDENT_INJECTION_RATE: 0.003,
  /** Ticks between KPI history snapshots */
  KPI_HISTORY_INTERVAL: 5,
  /** Maximum history points per zone (ring buffer size) */
  MAX_HISTORY_POINTS: 200,
  /** Ticks between crowd anomaly checks */
  ANOMALY_CHECK_INTERVAL: 5,
  /** Crowd density % threshold for anomaly alerts */
  ANOMALY_THRESHOLD_PERCENT: 92,
  /** Ticks between energy alert checks */
  ENERGY_ALERT_INTERVAL: 10,
  /** Temperature threshold for HVAC alerts (°F) */
  TEMPERATURE_ALERT_THRESHOLD: 79,
} as const;

// --- Energy Distribution Ratios ---
export const ENERGY = {
  /** HVAC share of total energy consumption */
  HVAC_RATIO: 0.65,
  /** Lighting share of total energy consumption */
  LIGHTING_RATIO: 0.25,
  /** Digital screens/signs share */
  DIGITAL_RATIO: 0.10,
  /** kg CO2 per kWh conversion factor */
  CARBON_PER_KWH: 0.45,
  /** Base renewable percentage */
  BASE_RENEWABLE_PERCENT: 30,
  /** Renewable oscillation amplitude */
  RENEWABLE_AMPLITUDE: 10,
  /** kWh per capacity unit for baseline comparison */
  BASELINE_KWH_PER_CAPACITY: 0.15,
} as const;

// --- Rate Limiting ---
export const RATE_LIMITS = {
  /** Max orders per minute */
  ORDERS_PER_MINUTE: 10,
  /** Max incident acknowledgements per minute */
  INCIDENTS_PER_MINUTE: 20,
  /** Max data deletion requests per minute */
  DELETIONS_PER_MINUTE: 5,
} as const;

// --- Accessibility ---
export const A11Y = {
  /** Minimum contrast ratio for normal text (WCAG AA) */
  MIN_CONTRAST_RATIO: 4.5,
  /** Minimum contrast ratio for large text (WCAG AA) */
  MIN_CONTRAST_RATIO_LARGE: 3.0,
  /** Animation duration when prefers-reduced-motion is set */
  REDUCED_MOTION_DURATION_MS: 0,
} as const;

// --- Fan Experience Defaults ---
export const DEFAULT_FAN_PROFILE = {
  name: 'Sarah Connor',
  seat: 'Sec 104, Row F, Seat 12',
  location: 'North Concourse Entrance',
  friends: [
    { name: 'Jake', distance: 45, zone: 'Aisle N Concessions', active: true },
    { name: 'David', distance: 120, zone: 'South Lower Stand', active: false },
  ],
  accessibility: {
    audioGuidance: false,
    accessibleRoutes: false,
    captions: false,
  },
  privacy: {
    locationShare: true,
    personalizedOffers: true,
    friendFinder: true,
  },
} as const;

export const AR_DIRECTIONS = [
  { instruction: 'Enter through Gate 3, scan digital ticket.', detail: 'Proceed straight for 20 meters' },
  { instruction: 'Turn left at North-East Concourse corridor.', detail: 'Aisle N Concession queue is currently 1 min.' },
  { instruction: 'Head toward Aisle 104 entry tunnel.', detail: 'Follow overhead blue beacon path indicators.' },
  { instruction: 'Arrive at Section 104, Row F, Seat 12.', detail: 'Welcome! You have reached your destination.' },
] as const;

export const CONCESSION_OFFERS = [
  {
    id: 'offer-1',
    title: 'Halftime Special Combo',
    desc: 'Pre-order 1 Large Soda + Pepperoni Pizza Slice. Skip Aisle N line entirely.',
    price: 12.00,
    discount: 20,
    eta: '2 min queue time',
  },
  {
    id: 'offer-2',
    title: 'Dynamic Refreshment Offer',
    desc: 'Slight crowd spike at Concessions - Get 15% off Cold Cola to pick up now.',
    price: 6.50,
    discount: 15,
    eta: '1 min queue time',
  },
] as const;

// --- Playbooks ---
export const TOURNAMENT_PLAYBOOKS = [
  {
    id: 'pb-overload',
    name: 'Capacity Overload Playbook',
    desc: 'Triggered when zone capacity >95%. Automated response: Open backup stair egress, adjust ticketing turnstile gates, route concourse team.',
    status: 'Ready' as const,
  },
  {
    id: 'pb-weather',
    name: 'Adverse Weather Evacuation',
    desc: 'Pre-position emergency medical tents. Auto-dispatch drone surveillance. Modulate lighting controls.',
    status: 'Ready' as const,
  },
  {
    id: 'pb-med-surge',
    name: 'Medical Surge Response',
    desc: 'Route emergency medical responders from neighboring zones. Alert dispatch team with exact coordinate GPS beacon tags.',
    status: 'Ready' as const,
  },
] as const;

// --- Privacy Audit Sample ---
export const SAMPLE_AUDIT_LOGS = [
  { time: '14:23:11', actor: 'System Incident Classifier', action: 'Trigger medical response routing', status: 'Approved' as const },
  { time: '14:21:05', actor: 'Concession Operator A1', action: 'Query zone crowd density aggregate', status: 'Approved' as const },
  { time: '14:18:40', actor: 'User App (Sarah Connor)', action: 'Export personal data profile (JSON)', status: 'Approved' as const },
  { time: '14:15:32', actor: 'Unknown Client', action: 'Direct query to personal location database', status: 'Denied (Least Privilege Blocked)' as const },
] as const;
