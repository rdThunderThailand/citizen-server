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

/**
 * @openapi
 * /api/locations/provinces:
 *   get:
 *     summary: List provinces
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/provinces",    locationsController.provinces);

/**
 * @openapi
 * /api/locations/districts:
 *   get:
 *     summary: List districts
 *     tags: [Locations]
 *     parameters:
 *       - in: query
 *         name: province_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/districts",    validateQuery(provinceQuerySchema), locationsController.districts);

/**
 * @openapi
 * /api/locations/subdistricts:
 *   get:
 *     summary: List subdistricts
 *     tags: [Locations]
 *     parameters:
 *       - in: query
 *         name: district_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/subdistricts", validateQuery(districtQuerySchema), locationsController.subdistricts);
export default router;
