// ─── src/modules/profile/profile.controller.ts ───────────────────────────────
import type { Request, Response } from "express";
import { profileService } from "./profile.service.js";
import { ok, fail, AppError } from "../../utils/response.js";
import type { AuthenticatedRequest, Profile } from "../../types/index.js";

export const profileController = {
  async get(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    try {
      const profile = await profileService.getByUserId(authReq.user.id);
      ok(res, { profile });
    } catch (e) {
      const err = e as AppError;
      fail(res, err.message, err.status ?? 500);
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    const updates = req.body as Partial<Profile>;

    try {
      const profile = await profileService.upsert(authReq.user.id, updates);
      ok(res, { success: true, profile });
    } catch (e) {
      const err = e as AppError;
      fail(res, err.message, err.status ?? 500);
    }
  },
};
