import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(data) {
    setServerError("");
    setLoading(true);
    try {
      await login(data.email, data.password);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Entrar</h2>
        <p className="login-subtitle">
          Acesse para buscar e cadastrar receitas.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <label>
            E-mail
            <input
              type="email"
              placeholder="seu@email.com"
              {...register("email", { required: "O e-mail é obrigatório." })}
            />
          </label>
          {errors.email && (
            <p className="validation-error">{errors.email.message}</p>
          )}

          <label>
            Senha
            <input
              type="password"
              placeholder="Sua senha"
              {...register("password", { required: "A senha é obrigatória." })}
            />
          </label>
          {errors.password && (
            <p className="validation-error">{errors.password.message}</p>
          )}

          {serverError && <p className="error-box">{serverError}</p>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="login-hint">
          <strong>Usuário de teste</strong>
          <span>usuario@receitas.com</span>
          <span>123456</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
