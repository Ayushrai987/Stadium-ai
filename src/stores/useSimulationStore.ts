// ============================================================
// Simulation State Store (Zustand)
// ============================================================
import { create } from 'zustand';
import type { EventPhase, SimulationState } from '../types';

interface SimulationStore extends SimulationState {
  start: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  setPhase: (phase: EventPhase) => void;
  tick: () => void;
}

export const useSimulationStore = create<SimulationStore>((set) => ({
  isRunning: false,
  speed: 1,
  currentTime: Date.now(),
  eventPhase: 'pre-event',
  tickCount: 0,

  start: () => set({ isRunning: true }),
  pause: () => set({ isRunning: false }),
  reset: () =>
    set({
      isRunning: false,
      speed: 1,
      currentTime: Date.now(),
      eventPhase: 'pre-event',
      tickCount: 0,
    }),
  setSpeed: (speed: number) => set({ speed }),
  setPhase: (phase: EventPhase) => set({ eventPhase: phase }),
  tick: () =>
    set((state) => ({
      tickCount: state.tickCount + 1,
      currentTime: state.currentTime + 1000 * state.speed,
    })),
}));
