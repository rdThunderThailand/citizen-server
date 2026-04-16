// ─── src/modules/verify-qr/verifyQr.controller.ts ────────────────────────────
import type { Request, Response } from "express";
import { verifyQrService } from "./verifyQr.service.js";
import { ok, fail, AppError } from "../../utils/response.js";

export const verifyQrController = {
  /** POST /api/verify-qr */
  async verify(req: Request, res: Response): Promise<void> {
    const { qr_code_data } = req.body as { qr_code_data: string };

    try {
      const result = await verifyQrService.verify(qr_code_data);
      const status = result.success ? 200 : result.reason === "not_found" ? 404 : 409;
      ok(res, result, status);
    } catch (e) {
      const err = e as AppError;
      fail(res, err.message, err.status ?? 500);
    }
  },
};
