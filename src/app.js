import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json()); // garante que o app entenda JSON no corpo das requisições
app.use(express.urlencoded({ extended: true })); // útil para formulários codificados

// Rotas
routes(app);

export default app;
