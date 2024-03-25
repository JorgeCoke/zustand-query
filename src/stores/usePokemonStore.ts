import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { QueryState, queryStore } from "./query-store";
import { getPokemonById } from "../services/pokemon.service";
import { Pokemon } from "../types/pokemon";

type State = {
  pokemon?: Pokemon;
};

// NOTE: prefix all actions with "do"
type Actions = {
  doGetPokemon: (number: number) => void;
};

const initialState: State = {
  pokemon: undefined,
};

export const usePokemonStore = create<State & Actions & QueryState>()(
  immer((set, get) => ({
    ...initialState,
    ...queryStore(set, initialState),
    doGetPokemon: async (id: number) => {
      const pokemon = await get().query(getPokemonById(id));
      set((state) => {
        state.pokemon = pokemon;
      });
    },
  }))
);
