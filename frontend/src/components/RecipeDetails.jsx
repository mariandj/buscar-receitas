import { useRecipeContext } from "../contexts/RecipeContext";

function RecipeDetails() {
  const { selectedRecipe, clearSelectedRecipe } = useRecipeContext();

  if (!selectedRecipe) {
    return null;
  }

  const recipe = selectedRecipe;

  return (
    <div className="details-overlay">
      <div className="details-modal">
        <button className="close-button" onClick={clearSelectedRecipe}>
          Fechar
        </button>

        <h2>{recipe.title}</h2>

        {recipe.image && (
          <img src={recipe.image} alt={recipe.title} className="details-image" />
        )}

        <p>
          <strong>Categoria:</strong> {recipe.category}
        </p>
        <p>
          <strong>Origem:</strong> {recipe.area}
        </p>

        {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
          <>
            <h3>Ingredientes</h3>
            <ul className="ingredients-list">
              {recipe.ingredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </>
        )}

        <h3>Modo de preparo</h3>
        <p className="instructions">{recipe.instructions}</p>

        {recipe.youtube && (
          <p>
            <strong>Vídeo:</strong>{" "}
            <a href={recipe.youtube} target="_blank" rel="noreferrer">
              Assistir no YouTube
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

export default RecipeDetails;
