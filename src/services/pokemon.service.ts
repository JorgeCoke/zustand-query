import { Pokemon } from "../types/pokemon";

export const getPokemonById = (id: number): Promise<Pokemon | undefined> =>
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(async (res) => await res.json())
    .catch(() => undefined);
