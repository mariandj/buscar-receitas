import { createContext, useContext, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Recupera token e usuário salvos no localStorage (mantém o login após refresh).
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const salvo = localStorage.getItem("user");
    return salvo ? JSON.parse(salvo) : null;
  });

  async function login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Repassa a mensagem de validação vinda do servidor.
      throw new Error(data.message || "Não foi possível fazer login.");
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  }

  function logout() {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
