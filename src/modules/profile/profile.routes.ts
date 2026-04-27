import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";
import { profileController } from "./profile.controller.js";

export const profileUpdateSchema = z.object({
  full_name: z.string().optional(),
  national_id: z.string().optional(),
  phone_number: z.string().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "No valid fields to update",
});

const router = Router();

/**
 * @openapi
 * /api/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get(   "/", requireAuth, profileController.get);

/**
 * @openapi
 * /api/profile:
 *   patch:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               national_id:
 *                 type: string
 *               phone_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.patch( "/", requireAuth, validateBody(profileUpdateSchema), profileController.update);
export default router;
