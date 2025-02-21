export type HttpError = { message: string; code: number };
export type QueryStore<I> = QueryStoreState & QueryStoreActions<I>;

// NOTE: Best practice -> Prefix all states with "is"
type QueryStoreState = {
  isLoading: boolean;
  isError: boolean;
  queryKeys: string[];
};

type QueryStoreActions<I> = {
  query: <R>(params: {
    queryFn: () => Promise<R>;
    queryKey?: string;
    onSuccess?: (result: R) => void | Promise<void>;
    onError?: (error: HttpError) => void | Promise<void>;
  }) => Promise<void>;
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
    query: async ({ queryFn, queryKey, onSuccess, onError }) => {
      if (!queryKey || (queryKey && !get().queryKeys.includes(queryKey))) {
        set((state) => {
          state.isError = false;
          state.isLoading = true;
          if (queryKey) {
            state.queryKeys = [...state.queryKeys, queryKey];
          }
        });
        await new Promise((r) => setTimeout(r, 2000)); // Simulate slow HTTP request
        const result = await queryFn().catch(async (error: HttpError) => {
          if (onError) {
            await onError(error);
          }
          set((state) => {
            state.isError = true;
            state.isLoading = state.queryKeys.length > 1;
            if (queryKey) {
              state.queryKeys = [
                ...state.queryKeys.filter((e) => e !== queryKey),
              ];
            }
          });
          throw error;
        });
        if (onSuccess) {
          await onSuccess(result);
        }
        set((state) => {
          state.isError = false;
          state.isLoading = state.queryKeys.length > 1;
          if (queryKey) {
            state.queryKeys = [
              ...state.queryKeys.filter((e) => e !== queryKey),
            ];
          }
        });
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
