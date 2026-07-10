import { create } from 'zustand';
import { type OperationalKPIs } from '../../types';

interface KPIState {
  kpis: OperationalKPIs;
  historicalKPIs: { timestamp: number; kpis: OperationalKPIs }[];
  updateKPIs: (updater: (prev: OperationalKPIs) => OperationalKPIs) => void;
  recordHistoricalKPI: () => void;
}

const defaultKPIs: OperationalKPIs = {
  queueTimeReduction: { before: 18, after: 12, percentChange: -33.3 },
  revenueLift: { baseline: 125000, current: 148500, percentChange: 18.8, conversionRate: 14.5 },
  emergencyResponseTime: { detection: 45, alert: 15, staffArrival: 110, total: 170, baseline: 720 }, // 170s = 2.8 min vs 12 min baseline
  energySavings: { current: 4850, baseline: 8080, percentSaved: 40.0, carbonReduced: 1650 }, // Qatar / ArenA scale
  fanSatisfaction: 88,
  sensorUptime: 98.4,
  incidentResolutionRate: 94.2,
};

export const useKPIStore = create<KPIState>((set) => ({
  kpis: defaultKPIs,
  historicalKPIs: [],

  updateKPIs: (updater) => set((state) => ({ kpis: updater(state.kpis) })),

  recordHistoricalKPI: () => set((state) => ({
    historicalKPIs: [
      ...state.historicalKPIs.slice(-59), // Keep last 60 items max
      { timestamp: Date.now(), kpis: state.kpis },
    ],
  })),
}));
