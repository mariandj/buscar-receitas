import { createContext, useContext, useReducer } from "react";

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

  async function searchRecipes(recipeName) {
    dispatch({ type: "FETCH_START" });

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
          recipeName
        )}`
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar dados da API.");
      }

      const data = await response.json();

      dispatch({
        type: "FETCH_SUCCESS",
        payload: data.meals || [],
      });
    } catch (error) {
      dispatch({
        type: "FETCH_ERROR",
        payload: "Não foi possível buscar as receitas. Tente novamente.",
      });
    }
  }

  function selectRecipe(recipe) {
    dispatch({
      type: "SELECT_RECIPE",
      payload: recipe,
    });
  }

  function clearSelectedRecipe() {
    dispatch({
      type: "CLEAR_SELECTED_RECIPE",
    });
  }

  function clearRecipes() {
    dispatch({
      type: "CLEAR_RECIPES",
    });
  }

  return (
    <RecipeContext.Provider
      value={{
        ...state,
        searchRecipes,
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