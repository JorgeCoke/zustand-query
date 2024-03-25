import "./App.css";
import { useCounterStore } from "./stores/useCounterStore";
import { usePokemonStore } from "./stores/usePokemonStore";

function App() {
  const { count, increment, decrement } = useCounterStore();
  const { loading, error, fetchPokemon, pokemon } = usePokemonStore();

  return (
    <>
      <h1>Zustand + HTTP Query Fetch</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button onClick={() => decrement(1)}>-</button>
        <p>
          Number is{" "}
          <code style={{ fontWeight: "bold", fontSize: "1rem" }}>{count}</code>
        </p>
        <button onClick={() => increment(1)}>+</button>
      </div>
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <button
          aria-disabled={loading}
          disabled={loading}
          onClick={() => fetchPokemon(count)}
        >
          {loading ? "Loading..." : "Fetch Pokemon Info"}
        </button>
        {pokemon && (
          <>
            <img
              style={{ width: "150px" }}
              src={pokemon.sprites.front_default}
            />
            <p style={{ fontWeight: "bold" }}>{pokemon.name}</p>
          </>
        )}
        {error && (
          <p style={{ fontWeight: "bold", color: "red" }}>
            Error trying to load Pokemon info
          </p>
        )}
      </div>
    </>
  );
}

export default App;
