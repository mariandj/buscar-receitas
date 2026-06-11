import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import Recipe from "../models/Recipe.js";

const USUARIO_INICIAL = {
  name: "Usuário Teste",
  email: "usuario@receitas.com",
  password: "123456",
};

const RECEITAS_INICIAIS = [
  {
    title: "Bolo de Cenoura",
    category: "Sobremesa",
    area: "Brasileira",
    instructions:
      "Bata no liquidificador a cenoura, os ovos e o óleo. Misture com o açúcar e a farinha. Adicione o fermento por último. Asse em forno médio por cerca de 40 minutos.",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
    youtube: "https://www.youtube.com/watch?v=video_bolo_cenoura",
    ingredients: ["cenoura", "ovo", "óleo", "açúcar", "farinha de trigo", "fermento"],
  },
  {
    title: "Panqueca Simples",
    category: "Café da manhã",
    area: "Americana",
    instructions:
      "Misture a farinha, o leite, o ovo e uma pitada de sal até formar uma massa lisa. Aqueça uma frigideira untada e despeje uma concha da massa. Doure dos dois lados.",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800",
    youtube: "https://www.youtube.com/watch?v=video_panqueca",
    ingredients: ["farinha de trigo", "leite", "ovo", "sal", "manteiga"],
  },
  {
    title: "Lasanha de Frango",
    category: "Prato principal",
    area: "Italiana",
    instructions:
      "Cozinhe e desfie o frango, refogue com molho de tomate. Monte camadas alternando massa de lasanha, frango e molho branco. Finalize com queijo e leve ao forno até gratinar.",
    image:
      "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800",
    youtube: "https://www.youtube.com/watch?v=video_lasanha",
    ingredients: [
      "massa de lasanha",
      "frango",
      "molho de tomate",
      "molho branco",
      "queijo mussarela",
    ],
  },
  {
    title: "Brigadeiro",
    category: "Sobremesa",
    area: "Brasileira",
    instructions:
      "Em uma panela, misture o leite condensado, o chocolate em pó e a manteiga. Cozinhe em fogo baixo mexendo até desgrudar do fundo. Deixe esfriar, enrole e passe no granulado.",
    image:
      "https://images.unsplash.com/photo-1612203985729-70726954388c?w=800",
    youtube: "https://www.youtube.com/watch?v=video_brigadeiro",
    ingredients: ["leite condensado", "chocolate em pó", "manteiga", "granulado"],
  },
  {
    title: "Omelete",
    category: "Café da manhã",
    area: "Francesa",
    instructions:
      "Bata os ovos com sal e pimenta. Despeje em uma frigideira aquecida e untada. Adicione o recheio de sua preferência e dobre a omelete ao meio quando estiver firme.",
    image:
      "https://images.unsplash.com/photo-1612240498936-65f5101365d2?w=800",
    youtube: "https://www.youtube.com/watch?v=video_omelete",
    ingredients: ["ovo", "sal", "pimenta", "queijo", "presunto"],
  },
];

async function seed() {
  try {
    await connectDB();

    // 1) Cria o usuário inicial somente se ele ainda não existir.
    let usuario = await User.findOne({ email: USUARIO_INICIAL.email });
    if (!usuario) {
      usuario = await User.create(USUARIO_INICIAL); // a senha é criptografada no pre-save
      console.log(`[SEED] Usuário criado: ${usuario.email}`);
    } else {
      console.log(`[SEED] Usuário já existe: ${usuario.email}`);
    }

    // 2) Cria as receitas iniciais sem duplicar (verifica pelo título).
    for (const dados of RECEITAS_INICIAIS) {
      const existe = await Recipe.findOne({ title: dados.title });
      if (existe) {
        console.log(`[SEED] Receita já existe: ${dados.title}`);
        continue;
      }
      await Recipe.create({ ...dados, createdBy: usuario._id });
      console.log(`[SEED] Receita criada: ${dados.title}`);
    }

    console.log("[SEED] Seed finalizado com sucesso.");
  } catch (error) {
    console.error("[SEED] Erro ao executar o seed:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("[SEED] Conexão encerrada.");
    process.exit(0);
  }
}

seed();
