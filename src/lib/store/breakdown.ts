import { create } from "zustand";
import { persist } from "zustand/middleware";

export type State = {
  breakdown: Map<string, number>;
  total: number;
};

export type Actions = {
  setBreakdown: (breakdown: Map<string, number>) => void;
  reset: () => void;
};

export const INITIAL_BREAKDOWN_DATA: Map<string, number> = new Map();

export const useBreakdownStore = create<State & Actions>()(
  persist(
    (set) => ({
      breakdown: INITIAL_BREAKDOWN_DATA,
      total: 0,
      setBreakdown: (breakdown) =>
        set(() => ({
          breakdown: breakdown,
          total: Array.from(breakdown.values()).reduce((acc, value) => acc + value, 0),
        })),
      reset: () =>
        set(() => ({
          breakdown: INITIAL_BREAKDOWN_DATA,
          total: 0,
        })),
    }),
    { name: "breakdown", skipHydration: true }
  )
);
