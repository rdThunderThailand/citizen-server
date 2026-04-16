// ─── src/middleware/auth.ts ───────────────────────────────────────────────────
import type { Request, Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../types/index.js";
import { buildUserClient } from "../lib/supabase.js";
import { env } from "../config/env.js";
import { fail } from "../utils/response.js";

/** Validates Bearer JWT; attaches req.user + req.userClient on success. */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    fail(res, "Unauthorized — missing Bearer token", 401);
    return;
  }

  const userClient = buildUserClient(authHeader);
  const { data: { user }, error } = await userClient.auth.getUser();

  if (error || !user) {
    fail(res, "Unauthorized — invalid or expired token", 401);
    return;
  }

  const authReq       = req as AuthenticatedRequest;
  authReq.user        = user;
  authReq.userClient  = userClient;
  next();
}

/** Validates x-staff-secret header against STAFF_SECRET env var. */
export function requireStaffSecret(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const providedSecret = req.headers["x-staff-secret"];
  if (!env.STAFF_SECRET || providedSecret !== env.STAFF_SECRET) {
    res.status(403).json({ success: false, reason: "forbidden" });
    return;
  }
  next();
}
