function RecipeCard({ recipe, onSelect, onEdit }) {
  return (
    <div className="recipe-card">
      {recipe.image ? (
        <img src={recipe.image} alt={recipe.title} />
      ) : (
        <div className="recipe-card-noimage">Sem imagem</div>
      )}
      <div className="recipe-card-body">
        <h3>{recipe.title}</h3>
        <p>
          <strong>Categoria:</strong> {recipe.category || "Não informada"}
        </p>
        <p>
          <strong>Origem:</strong> {recipe.area || "Não informada"}
        </p>
        <div className="recipe-card-actions">
          <button onClick={() => onSelect(recipe)}>Ver detalhes</button>
          <button className="edit-button" onClick={() => onEdit(recipe)}>
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
