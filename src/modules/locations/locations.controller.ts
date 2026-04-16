// ─── src/modules/locations/locations.controller.ts ───────────────────────────
import type { Request, Response } from "express";
import { locationsService, GEO_CACHE } from "./locations.service.js";
import { ok, fail, AppError } from "../../utils/response.js";

export const locationsController = {
  async provinces(_req: Request, res: Response): Promise<void> {
    try {
      const provinces = await locationsService.getProvinces();
      res.setHeader("Cache-Control", GEO_CACHE);
      ok(res, { provinces });
    } catch (e) {
      const err = e as AppError;
      fail(res, err.message, err.status ?? 500);
    }
  },

  async districts(req: Request, res: Response): Promise<void> {
    const province_id = req.query["province_id"] as string;

    try {
      const districts = await locationsService.getDistricts(province_id);
      res.setHeader("Cache-Control", GEO_CACHE);
      ok(res, { districts });
    } catch (e) {
      const err = e as AppError;
      fail(res, err.message, err.status ?? 500);
    }
  },

  async subdistricts(req: Request, res: Response): Promise<void> {
    const district_id = req.query["district_id"] as string;

    try {
      const subdistricts = await locationsService.getSubdistricts(district_id);
      res.setHeader("Cache-Control", GEO_CACHE);
      ok(res, { subdistricts });
    } catch (e) {
      const err = e as AppError;
      fail(res, err.message, err.status ?? 500);
    }
  },
};
