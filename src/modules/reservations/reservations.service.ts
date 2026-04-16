// ─── src/modules/reservations/reservations.service.ts ────────────────────────
import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../../utils/response.js";
import type { ReservationWithProject } from "../../types/index.js";

export const reservationsService = {
  /** List reservations for the authenticated user (newest first) */
  async listForUser(
    userId: string,
    userClient: SupabaseClient
  ): Promise<ReservationWithProject[]> {
    const { data, error } = await userClient
      .from("reservations")
      .select(`
        id, status, qr_code_data, created_at, used_at,
        projects:project_id (
          id, title, description, total_quota, remaining_quota
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new AppError("Failed to fetch reservations");
    return (data ?? []) as unknown as ReservationWithProject[];
  },
};
