import { useForm } from "react-hook-form";
import { useRecipeContext } from "../contexts/RecipeContext";

function SearchBar() {
  const { searchRecipes, clearRecipes } = useRecipeContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  function onSubmit(data) {
    searchRecipes(data.recipeName);
  }

  function handleClear() {
    reset();
    clearRecipes();
  }

  return (
    <div className="search-box">
      <h2>Buscar receitas</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="search-form">
        <input
          type="text"
          placeholder="Digite o nome da receita"
          {...register("recipeName", {
            required: "O nome da receita é obrigatório.",
            minLength: {
              value: 2,
              message: "Digite pelo menos 2 caracteres.",
            },
          })}
        />

        <button type="button" onClick={handleClear}>
          Limpar
        </button>

        <button type="submit">Buscar</button>
      </form>

      {errors.recipeName && (
        <p className="validation-error">{errors.recipeName.message}</p>
      )}
    </div>
  );
}

export default SearchBar;