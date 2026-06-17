import { useRecipeContext } from "../contexts/RecipeContext";
import RecipeCard from "./RecipeCard";

function RecipeList({ onEdit }) {
  const { recipes, loading, error, searched, selectRecipe } = useRecipeContext();

  if (loading) {
    return <p className="status-message">Carregando receitas...</p>;
  }

  if (error) {
    return <p className="status-message error-message">{error}</p>;
  }

  if (!searched) {
    return (
      <p className="status-message">Faça uma busca para visualizar receitas.</p>
    );
  }

  return (
    <div className="recipe-grid">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe._id}
          recipe={recipe}
          onSelect={selectRecipe}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default RecipeList;