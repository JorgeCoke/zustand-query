import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { QueryStore, queryStore } from "./query-store";
import { getPokemonById } from "../services/pokemon.service";
import { Pokemon } from "../types/pokemon";

type State = {
  pokemon?: Pokemon;
};

// NOTE: Best practice -> Prefix all actions with "do"
type Actions = {
  doGetPokemonById: (number: number) => void;
};

const initialState: State = {
  pokemon: undefined,
};

export const usePokemonStore = create<
  State & Actions & QueryStore<typeof initialState>
>()(
  immer((set, get) => ({
    ...queryStore(set, get, initialState),
    doGetPokemonById: (id) =>
      get().query({
        queryFn: () => getPokemonById(id),
        queryKey: `getPokemonById(${id})`,
        onSuccess: (result) => {
          set((state) => {
            state.pokemon = result;
          });
        },
      }),
  }))
);
