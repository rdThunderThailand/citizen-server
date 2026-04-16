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
router.get(   "/", requireAuth, profileController.get);
router.patch( "/", requireAuth, validateBody(profileUpdateSchema), profileController.update);
export default router;
