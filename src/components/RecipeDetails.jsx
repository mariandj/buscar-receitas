import { useRecipeContext } from "../contexts/RecipeContext";

function RecipeDetails() {
  const { selectedRecipe, clearSelectedRecipe } = useRecipeContext();

  if (!selectedRecipe) {
    return null;
  }

  return (
    <div className="details-overlay">
      <div className="details-modal">
        <button className="close-button" onClick={clearSelectedRecipe}>
          Fechar
        </button>

        <h2>{selectedRecipe.strMeal}</h2>

        <img
          src={selectedRecipe.strMealThumb}
          alt={selectedRecipe.strMeal}
          className="details-image"
        />

        <p>
          <strong>Categoria:</strong> {selectedRecipe.strCategory}
        </p>
        <p>
          <strong>Origem:</strong> {selectedRecipe.strArea}
        </p>

        <h3>Modo de preparo</h3>
        <p className="instructions">
          {selectedRecipe.strInstructions.replaceAll("STEP", "PASSO")}
        </p>

        {selectedRecipe.strYoutube && (
          <p>
            <strong>Vídeo:</strong>{" "}
            <a
              href={selectedRecipe.strYoutube}
              target="_blank"
              rel="noreferrer"
            >
              Assistir no YouTube
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

export default RecipeDetails;