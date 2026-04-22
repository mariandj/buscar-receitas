# 🍽️ Buscador de Receitas

Aplicação web desenvolvida com React.js que permite buscar receitas utilizando uma API pública. O projeto foi desenvolvido como parte da disciplina de Programação Web Fullstack.

## 🎯 Objetivo do projeto

Desenvolver uma aplicação frontend utilizando React.js que consuma dados de uma API JSON, aplicando conceitos de SPA, validação de formulários, gerenciamento de estado e componentização.

## 🚀 Funcionalidades

- Busca de receitas por nome
- Validação de campo obrigatório
- Exibição de mensagens de erro
- Listagem de receitas encontradas
- Visualização de detalhes da receita
- Limpeza da busca sem recarregar a página
- Atualização dinâmica (SPA - Single Page Application)


## 🛠️ Tecnologias utilizadas

- React.js
- Vite
- JavaScript
- Context API
- useReducer (gerenciamento de estado)
- React Hook Form (validação de formulário)
- CSS


## 🌐 API utilizada

- TheMealDB  
https://www.themealdb.com/api.php


## 📂 Estrutura do projeto
```bash
src/  
├── components/  
│ ├── SearchBar.jsx  
│ ├── RecipeList.jsx  
│ ├── RecipeCard.jsx  
│ ├── RecipeDetails.jsx  
│    
├── contexts/  
│ ├── RecipeContext.jsx  
│  
├── App.jsx  
├── main.jsx  
├── index.css  
```

## ▶️ Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/buscador-de-receitas.git  
````

### 2. Acessar a pasta
```bash
cd buscador-de-receitas
````

### 3. Instalar dependências
```bash
npm install
````
### 4. Rodar o projeto
```bash
npm run dev
````

### 5. Abrir no navegador
Observar o terminal, ele vai mostrar:
```bash
Local: http://localhost:XXXX/
```
Utilize esse link no navegador.

## 👩‍💻 Autora

Desenvolvido por [Maria Clara Nascimento de Jesus](https://www.linkedin.com/in/mariaclarandj).  
📚 UTFPR – Programação Web Fullstack
UTFPR (ES47B-ES71)