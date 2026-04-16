// ─── src/utils/response.ts ───────────────────────────────────────────────────
// Thin wrappers around res.json() to enforce consistent response envelope.
//
// Success:  { data: T }
// Error:    { error: string }
//
// Using these helpers means every endpoint returns the same shape,
// making frontend error handling predictable.
// ─────────────────────────────────────────────────────────────────────────────

import type { Response } from "express";

export function ok<T>(res: Response, data: T, status = 200): void {
  res.status(status).json(data);
}

export function fail(
  res: Response,
  message: string,
  status = 500
): void {
  res.status(status).json({ error: message });
}

// ─── AppError ─────────────────────────────────────────────────────────────────
// Throw this inside services/controllers to produce a structured HTTP error.

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly status: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}
