// ─── src/modules/locations/locations.service.ts ──────────────────────────────
import { adminClient } from "../../lib/supabase.js";
import { AppError } from "../../utils/response.js";

/** 1 hour — geo data changes very rarely */
export const GEO_CACHE = "public, max-age=3600, stale-while-revalidate=86400";

export const locationsService = {
  async getProvinces() {
    const { data, error } = await adminClient
      .from("provinces")
      .select("id, name_th, name_en, region")
      .order("name_th");
    if (error) throw new AppError("Failed to fetch provinces");
    return data ?? [];
  },

  async getDistricts(provinceId: string) {
    const { data, error } = await adminClient
      .from("districts")
      .select("id, name_th")
      .eq("province_id", provinceId)
      .order("name_th");
    if (error) throw new AppError("Failed to fetch districts");
    return data ?? [];
  },

  async getSubdistricts(districtId: string) {
    const { data, error } = await adminClient
      .from("subdistricts")
      .select("id, name_th, zip_code")
      .eq("district_id", districtId)
      .order("name_th");
    if (error) throw new AppError("Failed to fetch subdistricts");
    return data ?? [];
  },
};
