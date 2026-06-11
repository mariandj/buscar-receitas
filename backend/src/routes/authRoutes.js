import express from "express";
import jwt from "jsonwebtoken";
import validator from "validator";
import rateLimit from "express-rate-limit";
import User from "../models/User.js";
import { registrarLog } from "../config/logger.js";

const router = express.Router();

// Limita tentativas de login para prevenir ataques automatizados (força bruta).
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // no máximo 10 tentativas por IP na janela
  message: { message: "Muitas tentativas de login. Tente novamente mais tarde." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware de autenticação JWT.
// É exportado para ser reutilizado nas rotas de receitas (sem criar pasta middleware).
export function autenticar(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido. Faça login." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, name, email }
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
}

// POST /api/auth/login
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";

    // Validações de entrada
    if (!email || !password) {
      return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Informe um e-mail válido." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      registrarLog(`[LOGIN][FALHA] E-mail não encontrado: ${email}`);
      return res.status(401).json({ message: "E-mail ou senha inválidos." });
    }

    const senhaCorreta = await user.compararSenha(password);
    if (!senhaCorreta) {
      registrarLog(`[LOGIN][FALHA] Senha incorreta para: ${email}`);
      return res.status(401).json({ message: "E-mail ou senha inválidos." });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    registrarLog(`[LOGIN][SUCESSO] Usuário autenticado: ${email}`);

    return res.json({
      message: "Login realizado com sucesso.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    registrarLog(`[LOGIN][ERRO] ${error.message}`);
    return res.status(500).json({ message: "Erro interno ao realizar login." });
  }
});

export default router;
