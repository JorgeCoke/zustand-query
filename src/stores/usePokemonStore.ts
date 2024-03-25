import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { FetcherState, fetcherState } from "./fetcherStore";

type Pokemon = { id: number; name: string; sprites: { front_default: string } };

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

export const usePokemonStore = create<State & Actions & FetcherState>()(
  immer((set, get) => ({
    ...initialState,
    ...fetcherState(set, initialState),
    doGetPokemon: async (number: number) => {
      const pokemon = await get().query<Pokemon>(
        `https://pokeapi.co/api/v2/pokemon/${number}`
      );
      set((state) => {
        state.pokemon = pokemon;
      });
    },
  }))
);
