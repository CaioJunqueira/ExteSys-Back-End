import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5000",
  "https://extesys-front-end.vercel.app",
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // permite ferramentas como Postman
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("CORS policy: Origin não permitido"), false);
    }
    return callback(null, true);
  },
  credentials: true, // se usar cookies/autenticação
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

export default app;
