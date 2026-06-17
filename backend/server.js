import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";

import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import recipeRoutes from "./src/routes/recipeRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Middlewares de segurança e performance
app.use(helmet()); // headers de segurança
app.use(compression()); // compressão das respostas
app.use(express.json()); // parser de JSON

// CORS: libera somente o frontend definido em FRONTEND_URL
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Previne injection de operadores do MongoDB ($, .) nos dados de entrada
app.use(mongoSanitize());

// Logs de requisições HTTP
app.use(morgan("dev"));

// Rotas
app.get("/", (req, res) => {
  res.json({ message: "API Buscador de Receitas funcionando." });
});

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada." });
});

// Inicialização: conecta ao banco e sobe o servidor
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[SERVER] Rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("[SERVER] Falha ao conectar no MongoDB:", error.message);
    process.exit(1);
  });