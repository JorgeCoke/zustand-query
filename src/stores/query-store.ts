// NOTE: Best practice -> Prefix all states with "is"
export type QueryStore<I> = {
  isLoading: boolean;
  isError: boolean;
  query: <R>(fn: Promise<R | undefined>) => Promise<R | undefined>;
  reset: () => void;
  set: (fn: (a: I) => void) => void;
};

export const queryStore: <I extends object>(
  set: (setFn: (a: QueryStore<I> & typeof initialState) => void) => void,
  initialState: I
) => QueryStore<I> & typeof initialState = (set, initialState) => {
  return {
    ...initialState,
    isLoading: false,
    isError: false,
    query: async (fn) => {
      set((state) => {
        state.isLoading = true;
        state.isError = false;
      });
      const result = await fn;
      await new Promise((r) => setTimeout(r, 1000)); // Simulate slow HTTP request
      set((state) => {
        state.isLoading = false;
        state.isError = !result;
      });
      return result;
    },
    reset: () =>
      set((state) => {
        const keys = Object.keys(initialState) as Array<keyof typeof state>;
        keys.forEach((k) => {
          state[k] = (initialState as never)[k];
          state.isError = false;
          state.isLoading = false;
        });
      }),
    set,
  };
};
