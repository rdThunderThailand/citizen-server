import { Router } from "express";
import { z } from "zod";
import multer, { memoryStorage } from "multer";
import { VALID_REPORT_TYPES } from "./reports.service.js";
import { validateBody } from "../../middleware/validate.js";
import { reportsController } from "./reports.controller.js";

export const reportSchema = z.object({
  province_id: z.string().min(1, "province_id is required"),
  district_id: z.string().optional(),
  subdistrict_id: z.string().optional(),
  report_type: z.enum(VALID_REPORT_TYPES as [string, ...string[]]),
  description: z.string().min(1, "description is required"),
});

const upload = multer({
  storage: memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024, files: 5 },
});

const router = Router();
router.post(
  "/",
  upload.array("images", 5),
  validateBody(reportSchema),
  reportsController.submit
);
export default router;
