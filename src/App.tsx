import "./App.css";
import { useCounterStore } from "./stores/useCounterStore";
import { usePokemonStore } from "./stores/usePokemonStore";

function App() {
  const { count, doIncrement, doDecrement } = useCounterStore();
  const { isLoading, isError, doGetPokemonById, pokemon, reset, set } =
    usePokemonStore();

  return (
    <>
      <h1>Zustand + HTTP Query Fetch</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button onClick={() => doDecrement(1)}>-</button>
        <p>
          Number is{" "}
          <code style={{ fontWeight: "bold", fontSize: "1rem" }}>{count}</code>
        </p>
        <button onClick={() => doIncrement(1)}>+</button>
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
          aria-disabled={isLoading}
          disabled={isLoading}
          onClick={() => doGetPokemonById(count)}
        >
          {isLoading ? "Loading..." : "Get Pokemon Info"}
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
        {isError && (
          <p style={{ fontWeight: "bold", color: "red" }}>
            Error trying to load Pokemon info
          </p>
        )}
        <button
          aria-disabled={isLoading}
          disabled={isLoading}
          onClick={() => reset()}
        >
          Reset Example
        </button>
        <button
          aria-disabled={isLoading}
          disabled={isLoading}
          onClick={() => {
            set((state) => {
              state.pokemon = undefined;
            });
          }}
        >
          Set Example
        </button>
        <button onClick={() => doGetPokemonById(count)}>
          Click Click! Duplicated Requests are ignored!
        </button>
      </div>
    </>
  );
}

export default App;
