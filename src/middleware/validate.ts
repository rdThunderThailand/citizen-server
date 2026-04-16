// ─── src/middleware/validate.ts ───────────────────────────────────────────────
// Zod validation middleware for Express
// ─────────────────────────────────────────────────────────────────────────────

import type { Request, Response, NextFunction } from "express";
import { type AnyZodObject, type ZodEffects, ZodError } from "zod";
import { fail } from "../utils/response.js";

type AnyZodSchema = AnyZodObject | ZodEffects<AnyZodObject>;

export function validateBody(schema: AnyZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: e.errors,
        });
      } else {
        next(e);
      }
    }
  };
}

export function validateQuery(schema: AnyZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query) as any;
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: "Invalid query parameters",
          details: e.errors,
        });
      } else {
        next(e);
      }
    }
  };
}
