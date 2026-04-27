// ─── src/index.ts ─────────────────────────────────────────────────────────────
// CityZen API Server — entry point
// ─────────────────────────────────────────────────────────────────────────────

import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";

import { env } from "./config/env.js";
import { setupSwagger } from "./config/swagger.js";

// ── Module routers ────────────────────────────────────────────────────────────
import projectsRouter     from "./modules/projects/projects.routes.js";
import reservationsRouter from "./modules/reservations/reservations.routes.js";
import verifyQrRouter     from "./modules/verify-qr/verifyQr.routes.js";
import reportsRouter      from "./modules/reports/reports.routes.js";
import locationsRouter    from "./modules/locations/locations.routes.js";
import mapboxRouter       from "./modules/mapbox/mapbox.routes.js";
import profileRouter      from "./modules/profile/profile.routes.js";

// ── App ───────────────────────────────────────────────────────────────────────
const app: express.Express = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = env.CORS_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error(`CORS: origin "${origin}" not allowed`));
    },
    credentials:    true,
    methods:        ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "apikey", "x-client-info", "x-staff-secret"],
  })
);

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Request logger ────────────────────────────────────────────────────────────
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Health check ──────────────────────────────────────────────────────────────
/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: API Health Check
 *     description: Returns the health status and version of the API
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 version:
 *                   type: string
 *                   example: 2.0.0
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", version: "2.0.0", timestamp: new Date().toISOString() })
);

// ── Mount modules ─────────────────────────────────────────────────────────────
app.use("/api/mapbox-token", mapboxRouter);
app.use("/api/projects",     projectsRouter);
app.use("/api/reservations", reservationsRouter);
app.use("/api/verify-qr",    verifyQrRouter);
app.use("/api/reports",      reportsRouter);
app.use("/api/locations",    locationsRouter);
app.use("/api/profile",      profileRouter);

// ── Swagger ───────────────────────────────────────────────────────────────────
setupSwagger(app, env.PORT);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => res.status(404).json({ error: "Route not found" }));

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[Unhandled Error]", err);
  res.status(500).json({ error: err.message ?? "Internal server error" });
});

// ── Start ─────────────────────────────────────────────────────────────────────
if (!process.env.VERCEL) {
  app.listen(env.PORT, () => {
    console.log(`\n🏙️  CityZen API Server v2 running on http://localhost:${env.PORT}`);
    console.log(`   Health: http://localhost:${env.PORT}/api/health`);
    console.log(`\n`);
  });
}

export default app;
