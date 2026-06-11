import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_DIR = path.join(__dirname, "..", "..", "logs");
const LOG_FILE = path.join(LOG_DIR, "app.log");

// Garante que a pasta de logs exista.
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Registra uma mensagem no console e adiciona uma linha no arquivo de log.
export function registrarLog(mensagem) {
  const linha = `[${new Date().toISOString()}] ${mensagem}`;
  console.log(linha);
  fs.appendFile(LOG_FILE, linha + "\n", (err) => {
    if (err) console.error("[LOG] Falha ao gravar log:", err.message);
  });
}

export default registrarLog;
