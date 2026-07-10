import { create } from 'zustand';
import { type EventPhase } from '../../types';

interface SimulationState {
  isRunning: boolean;
  speed: number; // 1, 2, 5
  currentTime: number;
  eventPhase: EventPhase;
  tickCount: number;
  start: () => void;
  stop: () => void;
  setSpeed: (speed: number) => void;
  nextPhase: () => void;
  setPhase: (phase: EventPhase) => void;
  tick: () => void;
  reset: () => void;
}

const phases: EventPhase[] = [
  'pre-event',
  'gates-open',
  'filling',
  'first-half',
  'halftime',
  'second-half',
  'post-event',
];

export const useSimulationStore = create<SimulationState>((set, get) => ({
  isRunning: false,
  speed: 1,
  currentTime: Date.now(),
  eventPhase: 'pre-event',
  tickCount: 0,
  start: () => set({ isRunning: true }),
  stop: () => set({ isRunning: false }),
  setSpeed: (speed) => set({ speed }),
  nextPhase: () => {
    const current = get().eventPhase;
    const index = phases.indexOf(current);
    const nextIndex = (index + 1) % phases.length;
    set({ eventPhase: phases[nextIndex] });
  },
  setPhase: (eventPhase) => set({ eventPhase }),
  tick: () => set((state) => ({ 
    tickCount: state.tickCount + 1,
    currentTime: state.currentTime + 1000 * state.speed // progress simulated time
  })),
  reset: () => set({
    isRunning: false,
    speed: 1,
    currentTime: Date.now(),
    eventPhase: 'pre-event',
    tickCount: 0,
  }),
}));
