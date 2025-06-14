import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173", // Front local
  "https://extesys-front-end.vercel.app", // Front em produção
  "https://extesys-front-qz70remqs-caio-junqueiras-projects.vercel.app",
];

app.use(cors({
  origin: (origin, callback) => {
    // Permite Postman e ferramentas sem origem
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(
        new Error(`CORS policy: Origin ${origin} not allowed.`),
        false
      );
    }
  },
  credentials: true, // Se estiver usando cookies, JWT em cookie, sessões, etc.
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

export default app;
