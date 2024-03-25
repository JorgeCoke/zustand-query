import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  count: number;
};

type Actions = {
  increment: (qty: number) => void;
  decrement: (qty: number) => void;
};

const initialState: State = {
  count: 1,
};

export const useCounterStore = create<State & Actions>()(
  immer((set) => ({
    ...initialState,
    increment: (qty: number) =>
      set((state) => {
        state.count += qty;
      }),
    decrement: (qty: number) =>
      set((state) => {
        state.count -= qty;
      }),
  }))
);
