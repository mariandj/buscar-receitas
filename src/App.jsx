import SearchBar from "./components/SearchBar";
import RecipeList from "./components/RecipeList";
import RecipeDetails from "./components/RecipeDetails";

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Buscador de Receitas</h1>
        <p>Busque receitas utilizando a API TheMealDB</p>
      </header>

      <main>
        <SearchBar />
        <RecipeList />
        <RecipeDetails />
      </main>
    </div>
  );
}

export default App;