import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecipeContext } from "../contexts/RecipeContext";

function getFormValues(data) {
  return {
    title: data?.title ?? "",
    category: data?.category ?? "",
    area: data?.area ?? "",
    instructions: data?.instructions ?? "",
    image: data?.image ?? "",
    youtube: data?.youtube ?? "",
    ingredients: Array.isArray(data?.ingredients)
      ? data.ingredients.join(", ")
      : "",
  };
}

function RecipeForm({ mode = "create", initialData = null, onClose, onSuccess }) {
  const { addRecipe, updateRecipe, searchRecipes } = useRecipeContext();
  const isEditMode = mode === "edit";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: getFormValues(initialData),
  });

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    reset(getFormValues(initialData));
    setServerError("");
    setSuccessMessage("");
  }, [initialData, mode, reset]);

  async function onSubmit(data) {
    setServerError("");
    setSuccessMessage("");
    setLoading(true);

    const ingredients = data.ingredients
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const payload = {
      title: data.title,
      category: data.category,
      area: data.area,
      instructions: data.instructions,
      image: data.image,
      youtube: data.youtube,
      ingredients,
    };

    try {
      const result = isEditMode
        ? await updateRecipe(initialData._id, payload)
        : await addRecipe(payload);

      setSuccessMessage(
        result.message ||
          (isEditMode
            ? "Receita atualizada com sucesso."
            : "Receita cadastrada com sucesso.")
      );

      if (!isEditMode) {
        reset();
      }

      searchRecipes(data.title);
      onSuccess?.(result.recipe);

      setTimeout(() => {
        onClose?.();
      }, 1500);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="recipe-form-box">
      <div className="recipe-form-header">
        <h2>{isEditMode ? "Editar receita" : "Cadastrar nova receita"}</h2>
        <button
          type="button"
          className="form-close-button"
          onClick={onClose}
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="recipe-form">
        <div className="form-row">
          <label>
            Título
            <input
              type="text"
              placeholder="Ex: Bolo de Chocolate"
              {...register("title", { required: "O título é obrigatório." })}
            />
            {errors.title && (
              <span className="validation-error">{errors.title.message}</span>
            )}
          </label>

          <label>
            Categoria
            <input
              type="text"
              placeholder="Ex: Sobremesa"
              {...register("category", {
                required: "A categoria é obrigatória.",
              })}
            />
            {errors.category && (
              <span className="validation-error">
                {errors.category.message}
              </span>
            )}
          </label>
        </div>

        <div className="form-row">
          <label>
            Origem (Área)
            <input
              type="text"
              placeholder="Ex: Brasileira"
              {...register("area", { required: "A origem é obrigatória." })}
            />
            {errors.area && (
              <span className="validation-error">{errors.area.message}</span>
            )}
          </label>

          <label>
            Imagem (URL) — opcional
            <input
              type="text"
              placeholder="https://..."
              {...register("image")}
            />
          </label>
        </div>

        <label>
          Vídeo do YouTube (URL) — opcional
          <input type="text" placeholder="https://..." {...register("youtube")} />
        </label>

        <label>
          Ingredientes (separados por vírgula)
          <input
            type="text"
            placeholder="farinha, leite, ovo, açúcar"
            {...register("ingredients", {
              required: "Informe ao menos um ingrediente.",
            })}
          />
          {errors.ingredients && (
            <span className="validation-error">
              {errors.ingredients.message}
            </span>
          )}
        </label>

        <label>
          Modo de preparo
          <textarea
            rows={4}
            placeholder="Descreva o passo a passo da receita"
            {...register("instructions", {
              required: "O modo de preparo é obrigatório.",
            })}
          />
          {errors.instructions && (
            <span className="validation-error">
              {errors.instructions.message}
            </span>
          )}
        </label>

        {serverError && <p className="error-box">{serverError}</p>}
        {successMessage && <p className="success-box">{successMessage}</p>}

        <div className="form-actions">
          <button type="button" className="form-cancel-button" onClick={onClose}>
            Fechar
          </button>
          <button type="submit" disabled={loading}>
            {loading
              ? isEditMode
                ? "Salvando..."
                : "Cadastrando..."
              : isEditMode
                ? "Salvar alterações"
                : "Cadastrar receita"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RecipeForm;