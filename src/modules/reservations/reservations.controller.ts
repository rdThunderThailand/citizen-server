// ─── src/modules/reservations/reservations.controller.ts ─────────────────────
import type { Request, Response } from "express";
import { reservationsService } from "./reservations.service.js";
import { ok, fail, AppError } from "../../utils/response.js";
import type { AuthenticatedRequest } from "../../types/index.js";

export const reservationsController = {
  /** GET /api/reservations */
  async list(req: Request, res: Response): Promise<void> {
    try {
      const authReq      = req as AuthenticatedRequest;
      const reservations = await reservationsService.listForUser(
        authReq.user.id,
        authReq.userClient
      );
      ok(res, { reservations });
    } catch (e) {
      const err = e as AppError;
      fail(res, err.message, err.status ?? 500);
    }
  },
};
