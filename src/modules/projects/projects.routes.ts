// ─── src/modules/projects/projects.routes.ts ─────────────────────────────────
// Declares ONLY: HTTP method + path + middleware + controller binding.
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { projectsController } from "./projects.controller.js";

const router = Router();

/**
 * @openapi
 * /api/projects:
 *   get:
 *     summary: List projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Success
 */
router.get(  "/",          projectsController.list);

/**
 * @openapi
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get(  "/:id",       projectsController.getById);

/**
 * @openapi
 * /api/projects/{id}/reserve:
 *   post:
 *     summary: Reserve a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.post( "/:id/reserve", requireAuth, projectsController.reserve);

export default router;
