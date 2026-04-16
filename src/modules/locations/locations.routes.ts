import { Router } from "express";
import { z } from "zod";
import { locationsController } from "./locations.controller.js";
import { validateQuery } from "../../middleware/validate.js";

export const provinceQuerySchema = z.object({
  province_id: z.string().min(1, "province_id query param is required"),
});

export const districtQuerySchema = z.object({
  district_id: z.string().min(1, "district_id query param is required"),
});

const router = Router();
router.get("/provinces",    locationsController.provinces);
router.get("/districts",    validateQuery(provinceQuerySchema), locationsController.districts);
router.get("/subdistricts", validateQuery(districtQuerySchema), locationsController.subdistricts);
export default router;
