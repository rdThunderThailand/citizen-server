import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { reservationsController } from "./reservations.controller.js";

const router = Router();

/**
 * @openapi
 * /api/reservations:
 *   get:
 *     summary: List reservations for the current user
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", requireAuth, reservationsController.list);
export default router;
