// Mapbox just returns a token — no separate service needed
import { Router, type Request, type Response } from "express";
import { env } from "../../config/env.js";
import { ok, fail } from "../../utils/response.js";

const router = Router();

router.get("/", (_req: Request, res: Response): void => {
  if (!env.MAPBOX_TOKEN) {
    fail(res, "MAPBOX_TOKEN not configured on server");
    return;
  }
  res.setHeader("Cache-Control", "public, max-age=3600");
  ok(res, { token: env.MAPBOX_TOKEN });
});

export default router;
