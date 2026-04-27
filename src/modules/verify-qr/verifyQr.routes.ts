import { Router } from "express";
import { z } from "zod";
import { requireStaffSecret } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";
import { verifyQrController } from "./verifyQr.controller.js";

export const verifyQrSchema = z.object({
  qr_code_data: z.string().min(1, "QR code data is required"),
});

const router = Router();

/**
 * @openapi
 * /api/verify-qr:
 *   post:
 *     summary: Verify a QR code
 *     tags: [Verify QR]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [qr_code_data]
 *             properties:
 *               qr_code_data:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.post(
  "/",
  requireStaffSecret,
  validateBody(verifyQrSchema),
  verifyQrController.verify
);
export default router;
