// ─── src/modules/projects/projects.service.ts ────────────────────────────────
// Business logic + DB queries.
// No Express req/res here — pure functions, easy to unit-test.
// ─────────────────────────────────────────────────────────────────────────────

import { adminClient } from "../../lib/supabase.js";
import { AppError } from "../../utils/response.js";
import type { Project, ReserveResponse } from "../../types/index.js";
import type { SupabaseClient } from "@supabase/supabase-js";

export const projectsService = {
  /** List all active projects, newest first */
  async list(): Promise<Project[]> {
    const { data, error } = await adminClient
      .from("projects")
      .select(
        "id, title, description, total_quota, remaining_quota, start_date, end_date, is_active, created_at"
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw new AppError("Failed to fetch projects");
    return (data ?? []) as Project[];
  },

  /** Get a single project by id */
  async getById(id: string): Promise<Project> {
    const { data, error } = await adminClient
      .from("projects")
      .select(
        "id, title, description, total_quota, remaining_quota, start_date, end_date, is_active, priority_conditions"
      )
      .eq("id", id)
      .maybeSingle();

    if (error) throw new AppError("Failed to fetch project");
    if (!data)  throw new AppError("Project not found", 404);
    return data as Project;
  },

  /**
   * Atomically reserve a quota slot for a user.
   * Throws AppError on validation failures.
   */
  async reserve(
    projectId: string,
    userId: string,
    userClient: SupabaseClient
  ): Promise<ReserveResponse> {
    // 1. Verify profile completeness (national_id mandatory)
    const { data: profile } = await adminClient
      .from("profiles")
      .select("id, national_id")
      .eq("id", userId)
      .maybeSingle();

    if (!profile?.national_id) {
      return { success: false, reason: "profile_incomplete" };
    }

    // 2. Generate server-side QR payload — never trusted from client
    const qrCodeData = `RESERVE-${projectId}-${userId}-${Date.now()}`;

    // 3. Atomic RPC (SELECT FOR UPDATE inside SECURITY DEFINER function)
    const { data: rpcResult, error: rpcError } = await adminClient.rpc(
      "reserve_project_quota",
      { p_project_id: projectId, p_user_id: userId, p_qr_data: qrCodeData }
    );

    if (rpcError) {
      console.error("[projectsService.reserve] RPC error:", rpcError);
      throw new AppError("Reservation failed — server error");
    }

    if (rpcResult === true) {
      return { success: true, qr_code_data: qrCodeData };
    }

    // 4. Distinguish quota-full vs already-reserved
    const { data: existing } = await adminClient
      .from("reservations")
      .select("id")
      .eq("project_id", projectId)
      .eq("user_id", userId)
      .maybeSingle();

    return { success: false, reason: existing ? "already_reserved" : "quota_full" };
  },
};
