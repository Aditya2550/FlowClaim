import cors from "cors";
import express from "express";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { env } from "./config/env.js";

const app = express();
app.use(helmet());
app.use(compression());
app.use(cors({ origin: env.FRONTEND_URL }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(morgan("dev"));
app.use(express.json({ limit: "5mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api", routes);
app.use("/api/v1", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
