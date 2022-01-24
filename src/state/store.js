import create from "zustand"

export const useStore = create((set) => ({
  points: [],
  setPoints: (v) => set({ points: v }),
}))
