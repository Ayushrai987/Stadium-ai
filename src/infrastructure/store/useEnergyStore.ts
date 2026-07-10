import { create } from 'zustand';
import { type EnergyMetrics, type EnergyAlert } from '../../types';

interface EnergyState {
  metrics: EnergyMetrics | null;
  updateEnergyMetrics: (metrics: EnergyMetrics) => void;
  addPredictiveAlert: (alert: EnergyAlert) => void;
  clearAlert: (alertId: string) => void;
}

export const useEnergyStore = create<EnergyState>((set) => ({
  metrics: null,
  updateEnergyMetrics: (metrics) => set({ metrics }),
  addPredictiveAlert: (alert) => set((state) => {
    if (!state.metrics) return {};
    // Avoid duplicates
    if (state.metrics.predictiveAlerts.some((a) => a.id === alert.id)) return {};
    return {
      metrics: {
        ...state.metrics,
        predictiveAlerts: [...state.metrics.predictiveAlerts, alert],
      },
    };
  }),
  clearAlert: (alertId) => set((state) => {
    if (!state.metrics) return {};
    return {
      metrics: {
        ...state.metrics,
        predictiveAlerts: state.metrics.predictiveAlerts.filter((a) => a.id !== alertId),
      },
    };
  }),
}));
