import { useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import SearchBar from "./components/SearchBar";
import RecipeForm from "./components/RecipeForm";
import RecipeList from "./components/RecipeList";
import RecipeDetails from "./components/RecipeDetails";

function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const [formState, setFormState] = useState({
    open: false,
    mode: "create",
    recipe: null,
  });

  function openCreateForm() {
    setFormState({ open: true, mode: "create", recipe: null });
  }

  function openEditForm(recipe) {
    setFormState({ open: true, mode: "edit", recipe });
  }

  function closeForm() {
    setFormState({ open: false, mode: "create", recipe: null });
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="user-bar">
          <span className="user-info">
            Olá, <strong>{user?.name}</strong>
          </span>
          <button className="logout-button" onClick={logout}>
            Sair
          </button>
        </div>
        <h1>Buscador de Receitas</h1>
        <p>Busque e cadastre receitas no MongoDB Atlas</p>
      </header>

      <main>
        <SearchBar />
        <RecipeList onEdit={openEditForm} />
        <RecipeDetails />
      </main>

      <button
        type="button"
        className="fab-button"
        onClick={openCreateForm}
        aria-label="Cadastrar nova receita"
        title="Cadastrar nova receita"
      >
        +
      </button>

      {formState.open && (
        <div className="form-overlay">
          <div className="form-modal">
            <RecipeForm
              mode={formState.mode}
              initialData={formState.recipe}
              onClose={closeForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
