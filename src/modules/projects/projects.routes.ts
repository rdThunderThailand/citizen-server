// ─── src/modules/projects/projects.routes.ts ─────────────────────────────────
// Declares ONLY: HTTP method + path + middleware + controller binding.
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { projectsController } from "./projects.controller.js";

const router = Router();

router.get(  "/",          projectsController.list);
router.get(  "/:id",       projectsController.getById);
router.post( "/:id/reserve", requireAuth, projectsController.reserve);

export default router;
