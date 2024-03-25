export type FetcherState = {
  loading: boolean;
  error: boolean;
  query: <T>(url: string) => Promise<T | undefined>;
};

export const fetcherState: <T extends FetcherState>(
  set: (setFn: (a: T) => void) => void
) => FetcherState = (set) => {
  return {
    loading: false,
    error: false,
    query: async (url: string) => {
      set((state) => {
        state.loading = true;
        state.error = false;
      });
      const result = await fetch(url)
        .then(async (res) => await res.json())
        .catch(() => undefined);
      await new Promise((r) => setTimeout(r, 1000)); // Simulate slow HTTP request
      set((state) => {
        state.loading = false;
        state.error = !result;
      });
      return result;
    },
  };
};
