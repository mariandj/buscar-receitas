function RecipeCard({ recipe, onSelect }) {
  return (
    <div className="recipe-card">
      <img src={recipe.strMealThumb} alt={recipe.strMeal} />
      <div className="recipe-card-body">
        <h3>{recipe.strMeal}</h3>
        <p>
          <strong>Categoria:</strong> {recipe.strCategory || "Não informada"}
        </p>
        <p>
          <strong>Origem:</strong> {recipe.strArea || "Não informada"}
        </p>
        <button onClick={() => onSelect(recipe)}>Ver detalhes</button>
      </div>
    </div>
  );
}

export default RecipeCard;