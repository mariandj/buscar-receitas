import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "O nome é obrigatório."],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "O e-mail é obrigatório."],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "A senha é obrigatória."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Criptografa a senha com bcrypt antes de salvar, caso ela tenha sido alterada.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compara uma senha em texto puro com o hash armazenado.
userSchema.methods.compararSenha = function (senhaInformada) {
  return bcrypt.compare(senhaInformada, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
