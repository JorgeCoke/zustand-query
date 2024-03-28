export type QueryStore<I> = QueryStoreState & QueryStoreActions<I>;

// NOTE: Best practice -> Prefix all states with "is"
type QueryStoreState = {
  isLoading: boolean;
  isError: boolean;
  queryKeys: string[];
};

type QueryStoreActions<I> = {
  query: <R>(
    queryFn: () => Promise<R>,
    key: string,
    onCompleted: (result: R) => void | Promise<void>
  ) => Promise<void>;
  reset: () => void;
  set: (fn: (a: I) => void) => void;
};

const initialQueryStoreState: QueryStoreState = {
  isLoading: false,
  isError: false,
  queryKeys: [],
};

export const queryStore: <I extends object>(
  set: (setFn: (a: QueryStore<I> & typeof initialState) => void) => void,
  get: () => QueryStore<I> & typeof initialState,
  initialState: I
) => QueryStore<I> & typeof initialState = (set, get, initialState) => {
  return {
    ...initialState,
    ...initialQueryStoreState,
    query: async (fn, key, onCompleted) => {
      if (!get().queryKeys.includes(key)) {
        set((state) => {
          state.isError = false;
          state.isLoading = true;
          state.queryKeys = [...state.queryKeys, key];
        });
        await new Promise((r) => setTimeout(r, 2000)); // Simulate slow HTTP request
        const result = await fn().catch((err: Error) => {
          set((state) => {
            state.isError = true;
            state.isLoading = state.queryKeys.length > 1;
            state.queryKeys = [...state.queryKeys.filter((e) => e !== key)];
          });
          throw err;
        });
        set((state) => {
          state.isError = false;
          state.isLoading = state.queryKeys.length > 1;
          state.queryKeys = [...state.queryKeys.filter((e) => e !== key)];
        });
        await onCompleted(result);
      }
    },
    reset: () =>
      set((state) => {
        const keys = Object.keys(initialState) as Array<keyof typeof state>;
        keys.forEach((k) => {
          state[k] = (initialState as never)[k];
          state.isError = false;
          state.isLoading = false;
          state.queryKeys = [];
        });
      }),
    set,
  };
};
