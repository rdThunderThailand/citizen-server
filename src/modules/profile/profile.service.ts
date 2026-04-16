// ─── src/modules/profile/profile.service.ts ──────────────────────────────────
import { adminClient } from "../../lib/supabase.js";
import { AppError } from "../../utils/response.js";
import type { Profile } from "../../types/index.js";

export const profileService = {
  async getByUserId(userId: string): Promise<Profile | null> {
    const { data, error } = await adminClient
      .from("profiles")
      .select("id, full_name, national_id, phone_number, created_at, updated_at")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw new AppError("Failed to fetch profile");
    return (data ?? null) as Profile | null;
  },

  async upsert(userId: string, updates: Partial<Omit<Profile, "id" | "created_at">>): Promise<Profile> {
    const { data, error } = await adminClient
      .from("profiles")
      .upsert(
        { id: userId, ...updates, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      )
      .select("id, full_name, national_id, phone_number, updated_at")
      .single();
    if (error) throw new AppError("Failed to update profile");
    return data as Profile;
  },
};
