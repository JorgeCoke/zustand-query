// NOTE: prefix all states with "is"
export type QueryState = {
  isLoading: boolean;
  isError: boolean;
  query: <R>(fn: Promise<R | undefined>) => Promise<R | undefined>;
  reset: () => void;
};

export const queryStore: <S extends QueryState, I extends object>(
  set: (setFn: (a: S) => void) => void,
  initialState: I
) => QueryState = (set, initialState) => {
  return {
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
  };
};
