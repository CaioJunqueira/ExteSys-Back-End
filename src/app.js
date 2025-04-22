import express from "express";
import routes from "./routes/index.js";

const app = express();

// Rotas da aplicação
routes(app);

export default app;
