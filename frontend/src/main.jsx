import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { RecipeProvider } from "./contexts/RecipeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RecipeProvider>
        <App />
      </RecipeProvider>
    </AuthProvider>
  </React.StrictMode>
);