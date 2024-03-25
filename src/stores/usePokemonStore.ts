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
  doGetPokemon: (number: number) => void;
};

const initialState: State = {
  pokemon: undefined,
};

export const usePokemonStore = create<
  State & Actions & QueryStore<typeof initialState>
>()(
  immer((set, get) => ({
    ...queryStore(set, initialState),
    doGetPokemon: async (id: number) => {
      const pokemon = await get().query(getPokemonById(id));
      set((state) => {
        state.pokemon = pokemon;
      });
    },
  }))
);
