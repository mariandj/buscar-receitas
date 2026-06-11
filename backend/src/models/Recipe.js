import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "O título é obrigatório."],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "A categoria é obrigatória."],
    trim: true,
  },
  area: {
    type: String,
    required: [true, "A origem (área) é obrigatória."],
    trim: true,
  },
  instructions: {
    type: String,
    required: [true, "O modo de preparo é obrigatório."],
  },
  image: {
    type: String,
    default: "",
    trim: true,
  },
  youtube: {
    type: String,
    default: "",
    trim: true,
  },
  ingredients: {
    type: [String],
    required: [true, "Os ingredientes são obrigatórios."],
    validate: {
      validator: (arr) => Array.isArray(arr) && arr.length > 0,
      message: "Informe ao menos um ingrediente.",
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
