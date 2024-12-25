import { create } from "zustand"

const useStore = create((set) => ({
  mode: [],
  addMode: (param) =>
    set((state) => ({
      mode: [...state.mode, param],
    })),

  removeMode: (param) =>
    set((state) => ({
      mode: state.mode.filter((_mode) => _mode !== param),
    })),

  isRickRoll: false,
  switchRickRoll: () =>
    set((state) => ({
      isRickRoll: !state.isRickRoll
    })),

  results: [],
  setResults: (param) =>
    set(() => ({
      results: param,
    })),

  gameOver: false,
  setGameOver: (param) =>
    set(() => ({
      gameOver: param,
    })),
}))

export default useStore
