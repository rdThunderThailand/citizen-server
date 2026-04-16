// ─── src/modules/reports/reports.controller.ts ───────────────────────────────
import type { Request, Response } from "express";
import { reportsService, VALID_REPORT_TYPES } from "./reports.service.js";
import { ok, fail, AppError } from "../../utils/response.js";

export const reportsController = {
  /** POST /api/reports */
  async submit(req: Request, res: Response): Promise<void> {
    const { province_id, district_id, subdistrict_id, report_type, description } =
      req.body as Record<string, string>;

    try {
      const report = await reportsService.submit({
        province_id,
        district_id,
        subdistrict_id,
        report_type,
        description,
        files: (req.files ?? []) as Express.Multer.File[],
      });
      ok(res, { success: true, report }, 201);
    } catch (e) {
      const err = e as AppError;
      fail(res, err.message, err.status ?? 500);
    }
  },
};
