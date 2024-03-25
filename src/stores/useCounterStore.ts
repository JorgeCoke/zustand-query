import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  count: number;
};

// NOTE: prefix all actions with "do"
type Actions = {
  doIncrement: (qty: number) => void;
  doDecrement: (qty: number) => void;
};

const initialState: State = {
  count: 1,
};

export const useCounterStore = create<State & Actions>()(
  immer((set) => ({
    ...initialState,
    doIncrement: (qty: number) =>
      set((state) => {
        state.count += qty;
      }),
    doDecrement: (qty: number) =>
      set((state) => {
        state.count -= qty;
      }),
  }))
);
