import { create } from 'zustand';
import { SIMULATION } from '../../constants';

interface CrowdHistoryPoint {
  timestamp: number;
  occupancyPercent: number;
  queueTime: number;
}

interface CrowdState {
  history: Record<string, CrowdHistoryPoint[]>; // zoneId -> history
  anomalies: { id: string; zoneId: string; message: string; timestamp: number; acknowledged: boolean }[];
  addHistoryPoint: (zoneId: string, occupancyPercent: number, queueTime: number) => void;
  addAnomaly: (zoneId: string, message: string) => void;
  acknowledgeAnomaly: (id: string) => void;
  clearHistory: () => void;
}

export const useCrowdStore = create<CrowdState>((set) => ({
  history: {},
  anomalies: [],

  addHistoryPoint: (zoneId, occupancyPercent, queueTime) => set((state) => {
    const zoneHistory = state.history[zoneId] || [];
    const newPoint = { timestamp: Date.now(), occupancyPercent, queueTime };
    const updatedHistory = [...zoneHistory.slice(-(SIMULATION.MAX_HISTORY_POINTS - 1)), newPoint]; // Keep last MAX_HISTORY_POINTS
    return {
      history: {
        ...state.history,
        [zoneId]: updatedHistory,
      },
    };
  }),

  addAnomaly: (zoneId, message) => set((state) => {
    const id = `anom-${Math.random().toString(36).substring(2, 9)}`;
    const newAnomaly = { id, zoneId, message, timestamp: Date.now(), acknowledged: false };
    return {
      anomalies: [newAnomaly, ...state.anomalies.slice(0, 99)], // Limit to 100
    };
  }),

  acknowledgeAnomaly: (id) => set((state) => ({
    anomalies: state.anomalies.map((anom) =>
      anom.id === id ? { ...anom, acknowledged: true } : anom
    ),
  })),

  clearHistory: () => set({ history: {} }),
}));
