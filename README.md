# 🍽️ Buscador de Receitas — Fullstack

Aplicação **fullstack em 3 camadas** (React.js → Express.js → MongoDB Atlas) desenvolvida para a **Entrega 2** da disciplina de Programação Web Fullstack. Evolui o Projeto 1 (Buscador de Receitas) adicionando **login**, **busca** e **inserção** de receitas com autenticação e persistência em banco de dados.

## 🎯 Objetivo

Transformar o buscador de receitas em uma aplicação fullstack onde apenas usuários autenticados podem buscar e cadastrar receitas, que ficam armazenadas no MongoDB Atlas e são acessadas por meio de uma API REST em Express.js.

## 🛠️ Tecnologias

**Frontend**
- React.js + Vite
- Context API + useReducer
- React Hook Form
- CSS

**Backend**
- Node.js + Express.js
- MongoDB Atlas + Mongoose
- JWT (jsonwebtoken) + bcryptjs
- helmet, cors, compression
- express-rate-limit, express-mongo-sanitize, validator
- morgan + logs em arquivo

## 📂 Estrutura do projeto

```bash
buscar-receitas/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── RecipeForm.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── RecipeList.jsx
│   │   │   ├── RecipeCard.jsx
│   │   │   └── RecipeDetails.jsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── RecipeContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── .env.example
│   └── .gitignore
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js        # conexão Mongoose + pool
│   │   │   ├── seed.js      # popular o banco
│   │   │   └── logger.js    # logs em arquivo
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Recipe.js
│   │   └── routes/
│   │       ├── authRoutes.js   # login + middleware JWT
│   │       └── recipeRoutes.js # busca + inserção
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── README.md
```

## ☁️ Como configurar o MongoDB Atlas

1. Crie uma conta gratuita em [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Crie um **Cluster** (free tier `M0`).
3. Em **Database Access**, crie um usuário com senha.
4. Em **Network Access**, libere seu IP (ou `0.0.0.0/0` para testes).
5. Em **Connect → Drivers**, copie a *connection string*, algo como:
   ```
   mongodb+srv://usuario:senha@cluster.mongodb.net/buscar-receitas?retryWrites=true&w=majority
   ```
6. Use essa string no `MONGO_URI` do arquivo `.env` do backend.

## ▶️ Como rodar o backend

```bash
cd backend
# 1. crie o .env a partir do exemplo e preencha MONGO_URI / JWT_SECRET
copy .env.example .env      # Windows
# cp .env.example .env      # Linux/Mac

npm install
npm run seed   # popula o banco (usuário de teste + receitas)
npm run dev    # sobe a API em http://localhost:3000
```

## ▶️ Como rodar o frontend

```bash
cd frontend
copy .env.example .env      # Windows  (cp no Linux/Mac)

npm install
npm run dev    # abre em http://localhost:5173
```

## 🌱 Como rodar o seed

Na pasta `backend`:

```bash
npm run seed
```

O seed conecta ao banco, cria o usuário de teste e as receitas iniciais
(Bolo de Cenoura, Panqueca Simples, Lasanha de Frango, Brigadeiro, Omelete)
**sem duplicar** se executado mais de uma vez.

## 👤 Usuário de teste

```
nome: Usuário Teste
email: usuario@receitas.com
senha: 123456
```

## 🌐 Rotas da API

Base: `/api`

### Autenticação — `/api/auth`
| Método | Rota     | Descrição                         | Protegida |
|--------|----------|-----------------------------------|-----------|
| POST   | `/login` | Autentica e retorna token JWT     | Não       |

**Body:** `{ "email": "usuario@receitas.com", "password": "123456" }`

### Receitas — `/api/recipes` (exigem `Authorization: Bearer <token>`)
| Método | Rota                  | Descrição                                       |
|--------|-----------------------|-------------------------------------------------|
| GET    | `/?search=bolo`       | Busca por title, category, area e ingredients   |
| POST   | `/`                   | Cadastra uma nova receita                       |

**Body do POST:**
```json
{
  "title": "Bolo de Chocolate",
  "category": "Sobremesa",
  "area": "Brasileira",
  "instructions": "Misture os ingredientes e leve ao forno.",
  "image": "https://...",
  "youtube": "https://...",
  "ingredients": ["farinha", "chocolate", "ovo", "leite"]
}
```

## ✅ Funcionalidades implementadas

- Login com autenticação JWT
- Sessão persistida no `localStorage`
- Logout
- Rotas de receitas protegidas (apenas usuários logados)
- Busca de receitas no MongoDB (por título, categoria, área e ingredientes)
- Cadastro de novas receitas
- Listagem e detalhes da receita (com ingredientes e vídeo)
- Validação de formulários no frontend e no servidor

## 🔒 Medidas de segurança implementadas

- **Senhas criptografadas** com bcryptjs
- **JWT** com expiração de 2h e rotas protegidas
- **express-rate-limit** na rota de login (anti força-bruta)
- **express-mongo-sanitize** (anti NoSQL injection)
- **Validação e sanitização** de entradas no servidor (validator + escape de regex)
- **Proteção básica contra XSS** (sanitização de strings, sem render de HTML cru)
- **helmet** (headers de segurança)
- **compression** (compressão de respostas)
- **CORS** liberado somente para o frontend definido em `FRONTEND_URL`
- **Logs** de login, falhas de login, buscas e inserções (console + `backend/logs/app.log`)
- **Cache** em memória com TTL de 60s para as buscas
- **Pool de conexões** configurado no Mongoose (`maxPoolSize`)

## 👩‍💻 Autora

Desenvolvido por [Maria Clara Nascimento de Jesus](https://www.linkedin.com/in/mariaclarandj).
📚 UTFPR – Programação Web Fullstack (ES47B-ES71)
