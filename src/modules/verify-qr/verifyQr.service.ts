// ─── src/modules/verify-qr/verifyQr.service.ts ───────────────────────────────
import { adminClient } from "../../lib/supabase.js";
import { AppError } from "../../utils/response.js";
import type { VerifyQrResponse, ReservationWithRelations } from "../../types/index.js";

export const verifyQrService = {
  async verify(qrCodeData: string): Promise<VerifyQrResponse> {
    // 1. Look up reservation
    const { data, error: fetchError } = await adminClient
      .from("reservations")
      .select(`
        id, status, created_at, used_at, user_id, project_id,
        profiles:user_id ( full_name, national_id, phone_number ),
        projects:project_id ( title, description )
      `)
      .eq("qr_code_data", qrCodeData)
      .maybeSingle();

    if (fetchError) {
      console.error("[verifyQrService] Fetch error:", fetchError);
      throw new AppError("Server error during lookup");
    }

    if (!data) return { success: false, reason: "not_found" };

    const r = data as unknown as ReservationWithRelations;

    // 2. Status checks
    if (r.status === "used") {
      return {
        success: false,
        reason:  "already_used",
        used_at: r.used_at ?? undefined,
        reservation: {
          id:            r.id,
          status:        "used",
          holder_name:   r.profiles?.full_name   ?? "ไม่ระบุ",
          project_title: r.projects?.title       ?? "ไม่ระบุ",
        },
      };
    }

    if (r.status === "cancelled") return { success: false, reason: "cancelled" };

    // 3. Mark as used
    const usedAt = new Date().toISOString();
    const { error: updateError } = await adminClient
      .from("reservations")
      .update({ status: "used", used_at: usedAt })
      .eq("id", r.id);

    if (updateError) {
      console.error("[verifyQrService] Update error:", updateError);
      throw new AppError("Failed to mark reservation as used");
    }

    return {
      success: true,
      reservation: {
        id:            r.id,
        status:        "used",
        holder_name:   r.profiles?.full_name    ?? "ไม่ระบุชื่อ",
        national_id:   r.profiles?.national_id  ?? null,
        phone_number:  r.profiles?.phone_number ?? null,
        project_title: r.projects?.title        ?? "ไม่ระบุโครงการ",
        used_at:       usedAt,
      },
    };
  },
};
