import dotenv from "dotenv";
import app from "./src/app.js";
import { connectDB } from "./src/config/database.js";

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
});
