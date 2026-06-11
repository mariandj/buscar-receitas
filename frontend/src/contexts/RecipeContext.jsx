import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { useAuth } from "./AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const RecipeContext = createContext();

const initialState = {
  recipes: [],
  selectedRecipe: null,
  loading: false,
  error: "",
  searched: false,
};

function recipeReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        loading: true,
        error: "",
        searched: true,
      };

    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        recipes: action.payload,
        error:
          action.payload.length === 0
            ? "Nenhuma receita encontrada. Tente outro nome."
            : "",
      };

    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        recipes: [],
        error: action.payload,
      };

    case "SELECT_RECIPE":
      return {
        ...state,
        selectedRecipe: action.payload,
      };

    case "CLEAR_SELECTED_RECIPE":
      return {
        ...state,
        selectedRecipe: null,
      };

    case "CLEAR_RECIPES":
      return {
        ...state,
        recipes: [],
        error: "",
        searched: false,
      };

    default:
      return state;
  }
}

export function RecipeProvider({ children }) {
  const [state, dispatch] = useReducer(recipeReducer, initialState);
  const { token } = useAuth();

  // Busca receitas no backend Express (que consulta o MongoDB Atlas).
  const searchRecipes = useCallback(
    async (termo = "") => {
      if (!token) return;

      dispatch({ type: "FETCH_START" });

      try {
        const url = `${API_URL}/recipes?search=${encodeURIComponent(termo)}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || "Erro ao buscar receitas.");
        }

        const data = await response.json();
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "FETCH_ERROR",
          payload: error.message || "Não foi possível buscar as receitas.",
        });
      }
    },
    [token]
  );

  // Carrega todas as receitas assim que o usuário estiver autenticado.
  useEffect(() => {
    if (token) {
      searchRecipes("");
      return;
    }
    dispatch({ type: "CLEAR_RECIPES" });
  }, [token, searchRecipes]);

  // Insere uma nova receita no backend. Retorna a mensagem de sucesso do servidor.
  async function addRecipe(payload) {
    const response = await fetch(`${API_URL}/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao cadastrar receita.");
    }

    return data;
  }

  // Atualiza uma receita existente no backend.
  async function updateRecipe(id, payload) {
    const response = await fetch(`${API_URL}/recipes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao atualizar receita.");
    }

    return data;
  }

  function selectRecipe(recipe) {
    dispatch({ type: "SELECT_RECIPE", payload: recipe });
  }

  function clearSelectedRecipe() {
    dispatch({ type: "CLEAR_SELECTED_RECIPE" });
  }

  function clearRecipes() {
    dispatch({ type: "CLEAR_RECIPES" });
  }

  return (
    <RecipeContext.Provider
      value={{
        ...state,
        searchRecipes,
        addRecipe,
        updateRecipe,
        selectRecipe,
        clearSelectedRecipe,
        clearRecipes,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipeContext() {
  return useContext(RecipeContext);
}
