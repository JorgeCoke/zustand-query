// NOTE: prefix all states with "is"
export type FetcherState = {
  isLoading: boolean;
  isError: boolean;
  query: <R>(url: string) => Promise<R | undefined>;
  reset: () => void;
};

export const fetcherState: <S extends FetcherState, I extends object>(
  set: (setFn: (a: S) => void) => void,
  initialState: I
) => FetcherState = (set, initialState) => {
  return {
    isLoading: false,
    isError: false,
    query: async (url: string) => {
      set((state) => {
        state.isLoading = true;
        state.isError = false;
      });
      const result = await fetch(url)
        .then(async (res) => await res.json())
        .catch(() => undefined);
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
