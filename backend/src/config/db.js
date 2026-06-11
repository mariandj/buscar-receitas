import mongoose from "mongoose";

// Conecta ao MongoDB Atlas usando Mongoose.
// As opções configuram o pool de conexões e o timeout de seleção de servidor.
export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI não definido. Crie um arquivo .env baseado no .env.example.");
  }

  const conn = await mongoose.connect(uri, {
    maxPoolSize: 10, // limite de conexões simultâneas no pool
    minPoolSize: 1,
    serverSelectionTimeoutMS: 10000, // tempo máximo para encontrar um servidor
    socketTimeoutMS: 45000,
  });

  console.log(`[DB] Conectado ao MongoDB Atlas: ${conn.connection.host}`);
  return conn;
}

export default connectDB;
