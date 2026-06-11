import { useForm } from "react-hook-form";
import { useRecipeContext } from "../contexts/RecipeContext";

function SearchBar() {
  const { searchRecipes } = useRecipeContext();

  const { register, handleSubmit, reset } = useForm();

  function onSubmit(data) {
    searchRecipes(data.recipeName || "");
  }

  function handleClear() {
    reset();
    searchRecipes("");
  }

  return (
    <div className="search-box">
      <h2>Buscar receitas</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="search-form">
        <input
          type="text"
          placeholder="Buscar por receita, categoria ou ingrediente"
          {...register("recipeName")}
        />

        <button type="button" onClick={handleClear}>
          Limpar
        </button>

        <button type="submit">Buscar</button>
      </form>
    </div>
  );
}

export default SearchBar;
