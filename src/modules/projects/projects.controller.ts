// ─── src/modules/projects/projects.controller.ts ─────────────────────────────
// Parses HTTP request → calls service → sends response.
// Contains NO business logic or DB queries.
// ─────────────────────────────────────────────────────────────────────────────

import type { Request, Response } from "express";
import { projectsService } from "./projects.service.js";
import { ok, fail, AppError } from "../../utils/response.js";
import type { AuthenticatedRequest } from "../../types/index.js";

export const projectsController = {
  /** GET /api/projects */
  async list(_req: Request, res: Response): Promise<void> {
    try {
      const projects = await projectsService.list();
      ok(res, { projects });
    } catch (e) {
      const err = e as AppError;
      fail(res, err.message, err.status ?? 500);
    }
  },

  /** GET /api/projects/:id */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const project = await projectsService.getById(req.params["id"] as string);
      ok(res, { project });
    } catch (e) {
      const err = e as AppError;
      fail(res, err.message, err.status ?? 500);
    }
  },

  /** POST /api/projects/:id/reserve */
  async reserve(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const result  = await projectsService.reserve(
        req.params["id"] as string,
        authReq.user.id,
        authReq.userClient
      );

      const status = result.success ? 200 : 409;
      ok(res, result, status);
    } catch (e) {
      const err = e as AppError;
      fail(res, err.message, err.status ?? 500);
    }
  },
};
