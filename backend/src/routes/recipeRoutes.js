import express from "express";
import mongoose from "mongoose";
import validator from "validator";
import Recipe from "../models/Recipe.js";
import { autenticar } from "./authRoutes.js";
import { registrarLog } from "../config/logger.js";

const router = express.Router();

// Todas as rotas de receita exigem token JWT válido.
router.use(autenticar);

// ---------------------------------------------------------------------------
// Cache simples em memória com TTL curto (60s) para buscas.
// ---------------------------------------------------------------------------
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000;

function getCache(chave) {
  const item = cache.get(chave);
  if (!item) return null;
  if (Date.now() > item.expira) {
    cache.delete(chave);
    return null;
  }
  return item.dados;
}

function setCache(chave, dados) {
  cache.set(chave, { dados, expira: Date.now() + CACHE_TTL_MS });
}

function limparCache() {
  cache.clear();
}

// Remove caracteres perigosos básicos (proteção simples contra XSS/injection).
function sanitizarTexto(valor) {
  if (typeof valor !== "string") return "";
  return validator.escape(valor.trim());
}

// Valida e sanitiza o corpo de cadastro/edição de receita.
function processarDadosReceita(body) {
  const { title, category, area, instructions, image, youtube } = body;
  let { ingredients } = body;

  if (typeof ingredients === "string") {
    ingredients = ingredients.split(",");
  }
  if (!Array.isArray(ingredients)) {
    ingredients = [];
  }
  ingredients = ingredients
    .map((i) => sanitizarTexto(String(i)))
    .filter((i) => i.length > 0);

  const erros = [];
  if (!title || !String(title).trim()) erros.push("O título é obrigatório.");
  if (!category || !String(category).trim()) erros.push("A categoria é obrigatória.");
  if (!area || !String(area).trim()) erros.push("A origem (área) é obrigatória.");
  if (!instructions || !String(instructions).trim())
    erros.push("O modo de preparo é obrigatório.");
  if (ingredients.length === 0) erros.push("Informe ao menos um ingrediente.");

  const imageLimpa = image ? String(image).trim() : "";
  const youtubeLimpo = youtube ? String(youtube).trim() : "";
  if (imageLimpa && !validator.isURL(imageLimpa)) {
    erros.push("A URL da imagem é inválida.");
  }
  if (youtubeLimpo && !validator.isURL(youtubeLimpo)) {
    erros.push("A URL do vídeo é inválida.");
  }

  return {
    erros,
    dados: {
      title: sanitizarTexto(title),
      category: sanitizarTexto(category),
      area: sanitizarTexto(area),
      instructions: sanitizarTexto(instructions),
      image: imageLimpa,
      youtube: youtubeLimpo,
      ingredients,
    },
  };
}

// ---------------------------------------------------------------------------
// GET /api/recipes?search=termo
// Busca por title, category, area e ingredients. Sem search, retorna tudo.
// ---------------------------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const chaveCache = `search:${search.toLowerCase()}`;

    const emCache = getCache(chaveCache);
    if (emCache) {
      registrarLog(
        `[BUSCA][CACHE] termo="${search}" usuário=${req.user.email} resultados=${emCache.length}`
      );
      return res.json(emCache);
    }

    let filtro = {};
    if (search) {
      // Escapa caracteres especiais de regex para evitar injection na query.
      const termo = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(termo, "i");
      filtro = {
        $or: [
          { title: regex },
          { category: regex },
          { area: regex },
          { ingredients: regex },
        ],
      };
    }

    const recipes = await Recipe.find(filtro).sort({ createdAt: -1 });
    setCache(chaveCache, recipes);

    registrarLog(
      `[BUSCA] termo="${search}" usuário=${req.user.email} resultados=${recipes.length}`
    );

    return res.json(recipes);
  } catch (error) {
    registrarLog(`[BUSCA][ERRO] ${error.message}`);
    return res.status(500).json({ message: "Erro ao buscar receitas." });
  }
});

// ---------------------------------------------------------------------------
// POST /api/recipes
// Insere uma nova receita (com validação e sanitização no servidor).
// ---------------------------------------------------------------------------
router.post("/", async (req, res) => {
  try {
    const { erros, dados } = processarDadosReceita(req.body);

    if (erros.length > 0) {
      return res.status(400).json({ message: erros.join(" ") });
    }

    const recipe = await Recipe.create({
      ...dados,
      createdBy: req.user.id,
    });

    limparCache();

    registrarLog(
      `[INSERÇÃO] receita="${recipe.title}" usuário=${req.user.email}`
    );

    return res.status(201).json({
      message: "Receita cadastrada com sucesso.",
      recipe,
    });
  } catch (error) {
    registrarLog(`[INSERÇÃO][ERRO] ${error.message}`);
    return res.status(500).json({ message: "Erro ao cadastrar receita." });
  }
});

// ---------------------------------------------------------------------------
// PUT /api/recipes/:id
// Atualiza uma receita existente (com validação e sanitização no servidor).
// ---------------------------------------------------------------------------
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Receita não encontrada." });
    }

    const { erros, dados } = processarDadosReceita(req.body);

    if (erros.length > 0) {
      return res.status(400).json({ message: erros.join(" ") });
    }

    const recipe = await Recipe.findByIdAndUpdate(id, dados, {
      new: true,
      runValidators: true,
    });

    if (!recipe) {
      return res.status(404).json({ message: "Receita não encontrada." });
    }

    limparCache();

    registrarLog(
      `[EDIÇÃO] id=${recipe._id} receita="${recipe.title}" usuário=${req.user.email}`
    );

    return res.json({
      message: "Receita atualizada com sucesso.",
      recipe,
    });
  } catch (error) {
    registrarLog(`[EDIÇÃO][ERRO] ${error.message}`);
    return res.status(500).json({ message: "Erro ao atualizar receita." });
  }
});

export default router;
