// ─── src/types/index.ts ───────────────────────────────────────────────────────
// Shared TypeScript types across the server
// ─────────────────────────────────────────────────────────────────────────────

import type { User, SupabaseClient } from "@supabase/supabase-js";
import type { Request } from "express";

/** Augment Express Request to carry authenticated user data */
export interface AuthenticatedRequest extends Request {
  user: User;
  userClient: SupabaseClient;
}

// ─── Domain Types ─────────────────────────────────────────────────────────────

export type ReservationStatus = "reserved" | "used" | "cancelled";

export type ReportType = "road" | "electric" | "water" | "safety" | "other";

export interface Profile {
  id: string;
  full_name: string | null;
  national_id: string | null;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  total_quota: number;
  remaining_quota: number;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  priority_conditions: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  project_id: string;
  user_id: string;
  qr_code_data: string;
  status: ReservationStatus;
  created_at: string;
  used_at: string | null;
}

export interface ReservationWithProject extends Reservation {
  projects: Pick<Project, "id" | "title" | "description" | "total_quota" | "remaining_quota"> | null;
}

export interface ReservationWithRelations extends Reservation {
  profiles: Pick<Profile, "full_name" | "national_id" | "phone_number"> | null;
  projects: Pick<Project, "title" | "description"> | null;
}

// ─── API Response Shapes ──────────────────────────────────────────────────────

export interface VerifyQrSuccessResponse {
  success: true;
  reservation: {
    id: string;
    status: "used";
    holder_name: string;
    national_id: string | null;
    phone_number: string | null;
    project_title: string;
    used_at: string;
  };
}

export interface VerifyQrFailResponse {
  success: false;
  reason: "not_found" | "already_used" | "cancelled" | "forbidden" | "server_error" | "invalid_body";
  used_at?: string;
  reservation?: {
    id: string;
    status: string;
    holder_name: string;
    project_title: string;
  };
}

export type VerifyQrResponse = VerifyQrSuccessResponse | VerifyQrFailResponse;

export interface ReserveSuccessResponse {
  success: true;
  qr_code_data: string;
}

export interface ReserveFailResponse {
  success: false;
  reason: "profile_incomplete" | "already_reserved" | "quota_full" | "unauthorized" | "server_error" | "invalid_body";
}

export type ReserveResponse = ReserveSuccessResponse | ReserveFailResponse;
