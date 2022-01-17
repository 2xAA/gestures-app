import create from "zustand"

export const useStore = create(set => ({
  clientsArr: [],
  setClientsArr: v => set({ clientsArr: v }),

  recording: false,
  setRecording: v => set({ recording: v }),

  canRecord: false,
  setCanRecord: v => set({ canRecord: v })
}))
